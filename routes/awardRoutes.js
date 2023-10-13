const { Router } = require("express");
const route = Router();
const auth = require("../middlewares/auth");
const awardController = require("../controllers/awardController");

route.post("/api/add-award", auth, awardController.newAward);
route.delete("/api/remove-award/:id", auth, awardController.removeAward);

module.exports = route;
