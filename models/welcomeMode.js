var mongoose = require("mongoose");
const welcomeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  welcome_image: {
    type: String,
  },
});

module.exports = mongoose.model("Welcome", welcomeSchema);
