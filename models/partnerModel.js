var mongoose = require("mongoose");
const partnerSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  partners_image: {
    type: String,
  },
});

module.exports = mongoose.model("Partner", partnerSchema);
