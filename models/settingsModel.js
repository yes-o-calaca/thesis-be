var mongoose = require("mongoose");
const settingSchema = new mongoose.Schema({
  logo: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Setting", settingSchema);
