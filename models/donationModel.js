var mongoose = require("mongoose");
const donationSchema = new mongoose.Schema({
  donator: { type: mongoose.Schema.ObjectId, ref: "User" },
  donation_mode: { type: mongoose.Schema.ObjectId, ref: "Payment" },
  donation_amount: { type: String },
  donation_date: { type: Date },
  donation_receipt: { type: String },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Donation", donationSchema);
