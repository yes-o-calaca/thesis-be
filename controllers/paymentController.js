const Payment = require("../models/paymentModel");
const Donation = require("../models/donationModel");
const { sendemailApproveDonation } = require("../helpers/sendMail");

const paymentController = {
  addPayment: async (req, res) => {
    try {
      const { paymentName, paymentImage, active } = req.body;

      const newPayment = new Payment({
        paymentName,
        paymentImage,
        active,
      });
      const data = await newPayment.save();
      return res.status(200).json({ msg: "Payment Created", data });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPayment: async () => {
    try {
      const allPayment = await Payment.find();
      return allPayment;
    } catch (error) {
      return error;
    }
  },
  updatePayment: async (req, res) => {
    const paymentMethods = req.body;

    try {
      const updatedPayments = await Promise.all(
        paymentMethods.map(async (method) => {
          const { _id, active, paymentImage } = method;
          const updatedPayment = await Payment.findByIdAndUpdate(
            _id,
            { active, paymentImage },
            { new: true }
          );
          return updatedPayment;
        })
      );

      return res.status(200).json({ updatedPayments });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addDonation: async (req, res) => {
    try {
      const {
        donation_mode,
        donation_amount,
        donation_date,
        donation_receipt,
      } = req.body;

      const newDonor = new Donation({
        donator: req.user.id,
        donation_mode,
        donation_date,
        donation_amount,
        donation_receipt,
      });
      await newDonor.save();

      return res.status(200).json({ msg: "Donation Submitted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateDonation: async (req, res) => {
    const user = req.body;
    try {
      await Donation.findByIdAndUpdate(req.params.id, {
        approved: true,
      });
      const email = user.email;
      const name = user.first_name + " " + user.last_name;

      sendemailApproveDonation(email, name);
      return res.status(200).json({ msg: "Donation Approved" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDonation: async () => {
    try {
      const allDonation = await Donation.find()
        .populate("donator")
        .populate("donation_mode");
      return allDonation;
    } catch (error) {
      return error;
    }
  },
};
module.exports = paymentController;
