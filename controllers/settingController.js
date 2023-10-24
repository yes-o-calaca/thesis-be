const Settings = require("../models/settingsModel");
const Welcome = require("../models/welcomeMode");
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
      res.status(200).json({ msg: "Welcome Message Added Successfully" });
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
};
module.exports = settingController;
