var mongoose = require("mongoose");
const announcementSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.ObjectId, ref: "Project" },
  title: {
    type: String,
  },
  announcement_status: {
    type: Boolean,
    default: true,
  },
  announcement_image: {
    type: [],
  },
});

module.exports = mongoose.model("Announcement", announcementSchema);
