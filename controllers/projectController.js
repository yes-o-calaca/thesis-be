const Project = require("../models/projectModel");
const User = require("../models/userModel");
const sendMail = require("../helpers/sendMail");
const mongoose = require("mongoose");
const Feedback = require("../models/feedbackModel");
const Badge = require("../models/badgeModel");

const projectController = {
  newProj: async (req, res) => {
    try {
      const {
        project_title,
        project_description,
        project_article,
        project_image,
        date_start,
        date_end,
        volunteer_number,
        skill_required,
        age,
        gender,
        type,
      } = req.body;
      const volunteers = [];
      const feedbacks = [];

      //todo validator

      const newProj = new Project({
        project_title,
        project_description,
        project_article,
        project_image,
        date_start,
        date_end,
        volunteer_number,
        skill_required,
        volunteers,
        age,
        gender,
        type,
        feedbacks,
      });

      await newProj.save();
      //scucess
      res.status(200).json({ msg: "Project Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  addVolunteerProjects: async (req, res) => {
    try {
      await Project.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { volunteers: req.user.id } },
        { new: true }
      );
      return res.status(200).json({ msg: "Applied successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  removeVolunteerProjects: async (req, res) => {
    try {
      const { volunteer_id } = req.body;
      await Project.findByIdAndUpdate(
        req.params.id,
        { $pull: { volunteers: volunteer_id } },
        { new: true }
      );
      return res.status(200).json({ msg: "Removed successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateProj: async (req, res) => {
    try {
      const {
        project_title,
        project_description,
        project_article,
        project_image,
        date_start,
        date_end,
        volunteer_number,
        skill_required,
        age,
        gender,
        type,
      } = req.body;

      const projectId = req.params.id;

      const updateFields = {
        project_title,
        project_description,
        project_article,
        project_image,
        date_start,
        date_end,
        volunteer_number,
        age,
        gender,
        type,
      };

      const skillData = skill_required;
      const skillIds = Array.isArray(skillData)
        ? skillData.map((skill) => skill)
        : [];

      if (skillIds.length > 0) {
        await Project.findByIdAndUpdate(projectId, {
          ...updateFields,
          skill_required: skillIds,
        });
      } else {
        await Project.findByIdAndUpdate(projectId, updateFields);
      }

      res.status(200).json({ msg: "Project Updated Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  removeProj: async (req, res) => {
    try {
      await Project.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const projectId = req.params.id;

      const result = await Project.findByIdAndUpdate(projectId, {
        status: status,
      }).populate("volunteers");

      if (!result) {
        return res.status(404).json({ msg: "Project not found" });
      }

      const volunteers = result.volunteers.map((volunteer) => volunteer._id);

      const uniqueUserIds = new Set();

      result.volunteers.forEach((volunteer) => {
        uniqueUserIds.add(volunteer._id.toString());
      });

      const volunteerIds = Array.from(uniqueUserIds);

      const users = await User.find({
        _id: { $in: volunteerIds },
      });

      const userEmails = new Set();

      users.forEach((user) => {
        try {
          // Check if the user's email has been processed already
          if (!userEmails.has(user.email)) {
            userEmails.add(user.email);

            const emailContent = `Dear ${user.first_name}, the project with Title of  ${result.project_title} has been updated to ${status}.`;
            sendMail.sendUpdateProjectStatus(
              user.email,
              "Project Status Update",
              emailContent
            );
            console.log(emailContent);
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }
      });

      return res.status(200).json({ msg: "Applied successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPost: async () => {
    try {
      const allProject = await Project.find()
        ?.populate("skill_required")
        ?.populate("volunteers")
        ?.populate({
          path: "feedbacks",
          populate: {
            path: "feedbackUser",
          },
        });

      return allProject;
    } catch (error) {
      return error;
    }
  },

  newFeedback: async (data) => {
    try {
      const { feedback, id, userId } = data;

      const newFeedback = new Feedback({
        feedback,
        feedbackUser: userId,
      });

      const feedbackData = await newFeedback.save();
      await Project.findByIdAndUpdate(id, {
        $push: { feedbacks: feedbackData._id },
      });
      return feedbackData;
    } catch (error) {
      throw error;
    }
  },

  getFeedback: async () => {
    try {
      const allFeedback = await Feedback.find();
      return allFeedback;
    } catch (error) {
      throw error;
    }
  },

  addBadge: async (req, res) => {
    try {
      const { badgeIcon, name } = req.body;

      const newBadge = new Badge({
        badgeIcon,
        name,
      });

      await newBadge.save();

      res.status(200).json({ msg: "Badge Updated Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateUserBadge: async (req, res) => {
    const { _id } = req.body;
    try {
      await User.findByIdAndUpdate(_id, {
        $push: { badge: req.params.id },
      });
      res.status(200).json({ msg: "User Badge Updated Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateUserBadgesMant: async (req, res) => {
    const { _ids } = req.body;
    try {
      await User.updateMany(
        { _id: { $in: _ids } },
        {
          $push: { badge: req.params.id },
        }
      );
      res.status(200).json({ msg: "User Badges Updated Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getBadge: async () => {
    try {
      const allBadge = await Badge.find();
      return allBadge;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = projectController;
