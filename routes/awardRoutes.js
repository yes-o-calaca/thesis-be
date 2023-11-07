const { Router } = require("express");
const route = Router();
const auth = require("../middlewares/auth");
const awardController = require("../controllers/awardController");

route.post("/api/add-award", auth, awardController.newAward);
route.delete("/api/remove-award/:id", auth, awardController.removeAward);

//announcement
route.post("/api/add-announcement", auth, awardController.newAnnouncement);
route.delete(
  "/api/del-announcement/:id",
  auth,
  awardController.removeAnnouncement
);

module.exports = route;
