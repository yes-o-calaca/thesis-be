const Skill = require("../models/skillModel");

const skillController = {
  newSkill: async (req, res) => {
    try {
      const { skill_name } = req.body;
      console.log(skill_name);
      const sk = await Skill.findOne({ skill_name });
      if (sk) return res.status(400).json({ msg: "Skill Already Exist" });
      const newSkill = new Skill({
        skill_name,
      });

      await newSkill.save();
      //scucess
      res.status(200).json({ msg: "Skill Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateSkill: async (req, res) => {
    const { skill } = req.body;
    try {
      await Skill.findOneAndUpdate({ _id: req.params.id }, { skill_name });
      return res.status(200).json({ msg: "Updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeSkill: async (req, res) => {
    try {
      await Skill.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  },
  getSkill: async () => {
    try {
      const allSkill = await Skill.find();
      return allSkill;
    } catch (error) {
      return error;
    }
  },
};
module.exports = skillController;
