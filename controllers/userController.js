const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const createToken = require("../helpers/createToken");
const bcrypt = require("bcryptjs");
const validateEmail = require("../helpers/validateEmail");
const sendMail = require("../helpers/sendMail");
const Skill = require("../models/skillModel");
const { newSkill } = require("./skillController");

const userController = {
  register: async (req, res) => {
    try {
      const {
        email,
        first_name,
        middle_name,
        last_name,
        address,
        bday,
        gender,
        skills,
        contact,
        age,
      } = req.body;

      if (
        !email ||
        !first_name ||
        !middle_name ||
        !last_name ||
        !address ||
        !bday ||
        !gender ||
        !contact ||
        !age
      )
        return res.status(400).json({ msg: "Please fill in all the fields" });

      if (!validateEmail(email))
        return res
          .status(400)
          .json({ msg: "Please enter a valid email address" });

      const user = await User.findOne({ email });

      if (user)
        return res.status(400).json({ msg: "Email is already registered" });

      const password = Math.random().toString(36).slice(-8);

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const data = {
        email,
        first_name,
        middle_name,
        last_name,
        age,
        password: hashPassword,
        address,
        contact,
        bday,
        gender,
      };
      const name = first_name + " " + last_name;
      const activation_token = createToken.activation(data);
      const url = `https://www.yes-o-calaca-shs.com/activate?token=${activation_token}`;
      sendMail.sendEmailRegister(email, password, name, url);
      res.status(200).json({ msg: "Please check your email for verification" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  registerMany: async (req, res) => {
    try {
      const users = req.body; // Expect an array of user objects in the request body

      // Ensure that all required fields are provided for each user
      for (const user of users) {
        const {
          email,
          first_name,
          middle_name,
          last_name,
          address,
          bday,
          gender,
          contact,
          age,
        } = user;

        // if (
        //   !email ||
        //   !first_name ||
        //   !last_name ||
        //   !bday ||
        //   !contact
        //   // !age
        // )
        //   return res.status(400).json({ msg: "Please fill in all the fields" });

        // if (!validateEmail(email))
        //   return res
        //     .status(400)
        //     .json({ msg: "Please enter a valid email address" });

        const existingUser = await User.findOne({ email });

        if (existingUser)
          return res.status(400).json({ msg: "Email is already registered" });
      }
      const password = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      // Create an array of new users to be inserted
      const newUsers = users.map((user) => {
        return {
          ...user,
          password: hashPassword,
        };
      });

      // Use insertMany to insert multiple users at once
      const insertedUsers = await User.insertMany(newUsers);

      // You can now use the insertedUsers array to send responses or perform further actions.

      res.status(200).json({ msg: "Users added successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  resend: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ msg: "Email cannot be empty" });

      if (!validateEmail(email))
        return res
          .status(400)
          .json({ msg: "Please enter a valid email address" });

      const data = { email };
      const activation_token = createToken.activation(data);
      const url = `https://www.yes-o-calaca-shs.com/activate?token=${activation_token}`;
      // sendMail.sendEmailReverify(url);
      res.status(200).json({ msg: "Please check your email for verification" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  activate: async (req, res) => {
    try {
      //get token
      const { activation_token } = req.body;

      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
      const {
        email,
        first_name,
        middle_name,
        last_name,
        age,
        password,
        address,
        contact,
        bday,
        gender,
      } = user;

      const check = await User.findOne({ email });
      if (check)
        return res
          .status(400)
          .json({ msg: "This username is already registered" });

      const newUser = new User({
        email,
        first_name,
        middle_name,
        last_name,
        age,
        password,
        contact,
        address,
        bday,
        gender,
      });

      await newUser.save();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Email not found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect" });

      //refresh token
      const rf_token = createToken.refresh({ id: user._id });
      res.cookie("_apprftoken", rf_token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/api/auth/access",
        maxAge: 24 * 60 * 60 * 1000,
      });
      //scucess
      res.status(200).json({ msg: "Login Success" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  access: async (req, res) => {
    try {
      const rf_token = req.cookies._apprftoken;
      if (!rf_token) return res.status(400).json({ msg: "Please Sign in" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please Sign in again" });
        const ac_token = createToken.access({ id: user.id });
        return res.status(200).json({ ac_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  info: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select("-password")
        ?.populate("skills")
        ?.populate("badge");
      // console.log(user);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgot: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(200).json({ msg: "Email doesnt exist" });

      const ac_token = createToken.access({ id: user.id });

      const url = `https://www.yes-o-calaca-shs.com/reset?token=${ac_token}`;
      const name = user.first_name + " " + user.last_name;
      sendMail.sendEmailReset(email, url, name);
      return res.status(200).json({ msg: "Please check your email" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  reset: async (req, res) => {
    try {
      //get pass
      const { password } = req.body;
      //hash
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      //update
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { password: hashPassword }
      );
      //reset success
      res.status(200).json({ msg: "Password has been reset succesfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  remove: async (req, res) => {
    try {
      await User.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  },

  update_role: async (req, res) => {
    const { role } = req.body;
    try {
      await User.findOneAndUpdate({ _id: req.params.id }, { role });

      return res.status(200).json({ msg: "Updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  update_pesonal: async (req, res) => {
    const { first_name, last_name, contact, address, age } = req.body;
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { first_name, last_name, contact, address, age }
      );

      return res.status(200).json({ msg: "Updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  update_skill: async (req, res) => {
    try {
      const { skills } = req.body;
      const user = await User.findById(req.user.id);
      const newSkills = [];

      for (const skill_name of skills) {
        let existingSkill = await Skill.findOne({ skill_name });
        if (!existingSkill) {
          existingSkill = await Skill.create({ skill_name });
        }
        const skillId = existingSkill._id;
        newSkills.push(skillId);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { skills: { $each: newSkills } } },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Skills Added successfully", updatedUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  update_profile_pic: async (req, res) => {
    try {
      //get info
      const { avatar } = req.body;
      await User.findOneAndUpdate({ _id: req.user.id }, { avatar });
      // res.status(200).json({ msg: "Updated succesfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  remove_skill: async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { skills: req.params.id } },
        { new: true }
      );
      return res.status(200).json({ msg: "Skills Removed Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  signout: async (req, res) => {
    try {
      res.clearCookie("_apprftoken", { path: "/api/auth/access" });
      return res.status(200).json({ msg: "Signout success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllUser: async () => {
    try {
      const allUser = await User.find()?.populate("skills")?.populate("badge");
      return allUser;
    } catch (error) {
      return error;
    }
  },
};
module.exports = userController;
