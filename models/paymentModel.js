var mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    paymentName: {
      type: String,
    },
    paymentImage: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
