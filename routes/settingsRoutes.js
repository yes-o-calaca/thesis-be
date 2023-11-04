const { Router } = require("express");
const route = Router();
const auth = require("../middlewares/auth");
const settingController = require("../controllers/settingController");
const paymentController = require("../controllers/paymentController");

route.post("/api/new-logo", auth, settingController.newLogo);

//payment
route.post("/api/auth/payment", auth, paymentController.addPayment);
route.patch("/api/auth/update-payment", auth, paymentController.updatePayment);

//donation
route.post("/api/auth/donate", auth, paymentController.addDonation);
route.patch(
  "/api/auth/update-donate/:id",
  auth,
  paymentController.updateDonation
);

//partner
route.post("/api/add-welcome", auth, settingController.newWelcome);
route.post("/api/add-partners", auth, settingController.newPartner);
route.delete("/api/remove-partners/:id", auth, settingController.removePartner);

module.exports = route;
