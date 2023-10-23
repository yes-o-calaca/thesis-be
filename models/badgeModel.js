var mongoose = require("mongoose");
const badgeModel = new mongoose.Schema({
  badgeIcon: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model("Badge", badgeModel);
