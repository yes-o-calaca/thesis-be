var mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    feedbackAnswers: { type: Object },
    feedback: {
      type: String,
    },
    rating: {
      type: Number,
    },
    feedbackUser: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
