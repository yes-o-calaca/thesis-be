const VirtualPostModel = require("../models/virtualPostModel");
const VirtualPostInfo = require("../models/virtualPostDetailsModel");

const virtualPostController = {
  newVirtualPost: async (req, res) => {
    try {
      const { banner, post_day, title } = req.body;

      const day = await VirtualPostModel.findOne({ post_day });

      if (day)
        return res.status(400).json({ msg: "Details on this day exist" });

      const newVirtualPost = new VirtualPostModel({
        banner,
        post_day,
        title,
      });

      await newVirtualPost.save();
      //scucess
      res.status(200).json({ msg: "Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  removeVirtualPost: async (req, res) => {
    try {
      await VirtualPostModel.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  },

  newVirtualPostInformation: async (req, res) => {
    try {
      const { title, description, type, info } = req.body;

      const newVirtualPostInfo = new VirtualPostInfo({
        // banner,
        type,
        info,
        description,
        title,
      });

      const resp = await newVirtualPostInfo.save();
      await VirtualPostModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { post_information: resp._id } },
        { new: true }
      );
      res.status(200).json({ msg: "Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  removeVirtualPostInformation: async (req, res) => {
    try {
      await VirtualPostInfo.findByIdAndRemove(req.params.id);
      await VirtualPostModel.findOneAndUpdate(
        { post_information: { $elemMatch: { $eq: req.params.id } } },
        { $pull: { post_information: req.params.id } },
        { new: true }
      );
      res.status(200).json({ msg: "Removed Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getVirtualPost: async () => {
    try {
      const allVPost = await VirtualPostModel.find().populate(
        "post_information"
      );
      return allVPost;
    } catch (error) {
      return error;
    }
  },
  getVirtualPostSingle: async (req, res) => {
    try {
      const allVPostIn = await VirtualPostInfo.find();
      res.status(200).json(allVPostIn);
    } catch (error) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateVirtualPostSingle: async (req, res) => {
    const { info, title, description, type } = req.body;
    try {
      console.log(info, title, description, type);
      await VirtualPostInfo.findOneAndUpdate(
        { _id: req.params.id },
        {
          info,
          title,
          description,
          type,
        }
      );
      return res.status(200).json({ msg: "Updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = virtualPostController;
