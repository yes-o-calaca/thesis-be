const Settings = require("../models/settingsModel");

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
};
module.exports = settingController;
