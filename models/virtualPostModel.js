var mongoose = require("mongoose");
const vPostSchema = new mongoose.Schema({
  banner: {
    type: String,
  },
  post_day: {
    type: String,
  },
  title: {
    type: String,
  },
  post_information: [
    { type: mongoose.Schema.ObjectId, ref: "VirtualPostInfo" },
  ],
});

module.exports = mongoose.model("VirtualPost", vPostSchema);
