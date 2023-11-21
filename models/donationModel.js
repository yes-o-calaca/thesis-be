var mongoose = require("mongoose");
const donationSchema = new mongoose.Schema({
  donator: { type: mongoose.Schema.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.ObjectId, ref: "Payment" },
  donation_mode: { type: mongoose.Schema.ObjectId, ref: "Payment" },
  donation_date: { type: Date },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  image: { type: String },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Donation", donationSchema);
