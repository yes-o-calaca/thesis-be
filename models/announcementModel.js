var mongoose = require("mongoose");
const announcementSchema = new mongoose.Schema({
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
