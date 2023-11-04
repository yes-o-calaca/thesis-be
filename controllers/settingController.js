const Settings = require("../models/settingsModel");
const Welcome = require("../models/welcomeMode");
const Partner = require("../models/partnerModel");

const settingController = {
  newLogo: async (req, res) => {
    try {
      const { logo } = req.body;

      const newlogo = new Settings({
        logo,
      });

      await newlogo.save();
      //scucess
      res.status(200).json({ msg: "Logo Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getLogo: async () => {
    try {
      const allLogo = await Settings.find();
      return allLogo;
    } catch (error) {
      return error;
    }
  },

  newWelcome: async (req, res) => {
    try {
      const { title, welcome_image } = req.body;

      //todo validator

      const newAnnouncement = new Welcome({
        title,
        welcome_image,
      });

      await newAnnouncement.save();
      //scucess
      res.status(200).json({ msg: "Announcement Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  newPartner: async (req, res) => {
    try {
      const { title, partners_image } = req.body;

      //todo validator

      const newPartner = new Partner({
        title,
        partners_image,
      });

      await newPartner.save();
      //scucess
      res.status(200).json({ msg: "Partner Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  removePartner: async (req, res) => {
    try {
      await Partner.findByIdAndRemove(req.params.id);
      res.status(200).json({ msg: "Partner Removed" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getWelcome: async () => {
    try {
      const allWelcome = await Welcome.find();
      return allWelcome;
    } catch (error) {
      return error;
    }
  },

  getPartner: async () => {
    try {
      const allPartners = await Partner.find();
      return allPartners;
    } catch (error) {
      return error;
    }
  },
};
module.exports = settingController;
