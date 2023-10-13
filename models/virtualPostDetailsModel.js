var mongoose = require("mongoose");
const vPostInfoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  info: {
    type: String,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("VirtualPostInfo", vPostInfoSchema);
