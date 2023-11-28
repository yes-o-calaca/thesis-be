const Project = require("../models/projectModel");
const User = require("../models/userModel");
const sendMail = require("../helpers/sendMail");
const mongoose = require("mongoose");
const Feedback = require("../models/feedbackModel");
const Badge = require("../models/badgeModel");
const Notification = require("../models/notificationModel");
const VolunteerRole = require("../models/rolesModel");

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
        address,
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
        address,
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

      const notification = new Notification({
        project: req.params.id,
        volunteer: req.user.id,
        message: "You have been added as a volunteer to the project.",
      });

      await notification.save();

      return res.status(200).json({ msg: "Applied successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addCompletedProjects: async (req, res) => {
    try {
      const { completed_project_image } = req.body;
      await Project.findByIdAndUpdate(req.params.id, {
        completed_project_image,
      });

      return res.status(200).json({ msg: "Images Added Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addRoleProjects: async (req, res) => {
    try {
      const { role, volunteerId, project_title } = req.body;

      const isRole = await VolunteerRole.findOne({
        project: req.params.id,
        volunteer: volunteerId,
      });

      if (isRole) {
        await VolunteerRole.findOneAndUpdate(
          {
            project: req.params.id,
            volunteer: volunteerId,
          },
          { role }
        );
      } else {
        const vol = new VolunteerRole({
          project: req.params.id,
          volunteer: volunteerId,
          role,
        });
        await vol.save();
      }
      const user = await User.findOne({ _id: volunteerId });
      const name = user.first_name + " " + user.last_name;
      const email = user.email;

      sendMail.sendNotifRole(email, name, role, project_title);
      return res.status(200).json({ msg: "Role Added successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getRoleProjects: async (req, res) => {
    try {
      const responseData = await VolunteerRole.find({ project: req.params.id });
      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getVolunteerNotif: async () => {
    try {
      const allNotif = await Notification.find()?.populate("project");
      return allNotif;
    } catch (error) {
      throw error;
    }
  },

  patchVolunteerNotif: async (req, res) => {
    const { volunteerIds } = req.body;
    const projectId = req.params.id;

    try {
      const result = await Notification.updateMany(
        {
          project: projectId,
          volunteer: { $in: volunteerIds },
        },
        { $set: { read: true } }
      );
      res.status(200).json({ msg: "" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
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

      await Notification.findOneAndRemove({
        project: req.params.id,
        volunteer: volunteer_id,
      });

      await VolunteerRole.findOneAndRemove({
        project: req.params.id,
        volunteer: volunteer_id,
      });

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
        address,
        gender,
        type,
        project_update,
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
        address,
        gender,
        type,
        project_update,
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

      console.log(project_update);
      if (project_update) {
        const result = await Project.findById(req.params.id).populate(
          "volunteers"
        );

        const volunteers = result.volunteers.map((volunteer) => volunteer._id);

        const uniqueUserIds = new Set();

        result.volunteers.forEach((volunteer) => {
          uniqueUserIds.add(volunteer._id.toString());
        });

        const volunteerIds = Array.from(uniqueUserIds);

        const users = await User.find({
          _id: { $in: volunteerIds },
        });

        users.forEach((user) => {
          try {
            sendMail.sendUpdateProject(
              user.email,
              user.first_name + " " + user.last_name,
              project_title,
              project_update
            );
          } catch (error) {
            console.error("Error sending email:", error);
          }
        });
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
      let allProject = await Project.find()

        ?.populate("skill_required")
        ?.populate("volunteers")
        ?.populate({
          path: "feedbacks",
          populate: {
            path: "feedbackUser",
          },
        });

      allProject = allProject.reverse();

      return allProject;
    } catch (error) {
      return error;
    }
  },

  newFeedback: async (data) => {
    try {
      const { feedback, id, userId, feedbackAnswers } = data;

      const newFeedback = new Feedback({
        feedbackAnswers,
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
