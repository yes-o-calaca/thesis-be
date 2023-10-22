var mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    feedback: {
      type: String,
    },
    rating: {
      type: Number,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
