const Award = require("../models/awardsModel");
const Announcement = require("../models/announcementModel");
const sendMail = require("../helpers/sendMail");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const awardController = {
  newAward: async (req, res) => {
    try {
      const { title, description, date, award_image } = req.body;

      //todo validator

      const newAward = new Award({
        title,
        description,
        date,
        award_image,
      });

      await newAward.save();
      //scucess
      res.status(200).json({ msg: "Awards Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  removeAward: async (req, res) => {
    try {
      await Award.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  },

  getAward: async () => {
    try {
      const allAward = await Award.find();
      return allAward;
    } catch (error) {
      return error;
    }
  },

  newAnnouncement: async (req, res) => {
    try {
      const { title, announcement_image, project, project_name } = req.body;

      //todo validator

      const newAnnouncement = new Announcement({
        title,
        announcement_image,
        project,
      });

      await newAnnouncement.save();

      if (project) {
        const result = await Project.findById(project).populate("volunteers");

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
            sendMail.sendAnnouncement(
              user.email,
              user.first_name + " " + user.last_name,
              project_name,
              title,
              announcement_image
            );
          } catch (error) {
            console.error("Error sending email:", error);
          }
        });
      }

      //scucess
      res.status(200).json({ msg: "Announcement Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  removeAnnouncement: async (req, res) => {
    try {
      await Announcement.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  },

  getAnnouncement: async () => {
    try {
      const allAnnouncement = await Announcement.find();
      return allAnnouncement;
    } catch (error) {
      return error;
    }
  },
};
module.exports = awardController;
