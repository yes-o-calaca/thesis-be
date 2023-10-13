var mongoose = require("mongoose");
const awardSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  award_image: {
    type: [],
  },
});

module.exports = mongoose.model("Awards", awardSchema);
