var mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    project_title: {
      type: String,
      trim: true,
    },
    project_description: {
      type: String,
    },
    project_article: {
      type: String,
    },
    project_image: {
      type: String,
    },
    date_start: {
      type: Date,
    },
    date_end: {
      type: Date,
    },
    volunteer_number: {
      type: String,
    },
    age: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    type: {
      type: String,
    },
    project_update: { type: String },
    skill_required: [{ type: mongoose.Schema.ObjectId, ref: "Skill" }],
    volunteers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    feedbacks: [{ type: mongoose.Schema.ObjectId, ref: "Feedback" }],
    status: { type: String, default: "pending" },
    completed_project_image: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
