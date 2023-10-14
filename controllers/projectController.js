const Project = require("../models/projectModel");

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
      await Project.findByIdAndUpdate(req.params.id, { status: status });
      return res.status(200).json({ msg: "Applied successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPost: async () => {
    try {
      const allProject = await Project.find()
        ?.populate("skill_required")
        .populate("volunteers");
      return allProject;
    } catch (error) {
      return error;
    }
  },
};
module.exports = projectController;
