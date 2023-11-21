var mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerRole", rolesSchema);
