const Award = require("../models/awardsModel");
const Announcement = require("../models/announcementModel");

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
      const { title, announcement_image } = req.body;

      //todo validator

      const newAnnouncement = new Announcement({
        title,
        announcement_image,
      });

      await newAnnouncement.save();
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
