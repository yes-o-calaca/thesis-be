var mongoose = require("mongoose");
const skillSchema = new mongoose.Schema({
  skill_name: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Skill", skillSchema);
