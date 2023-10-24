const { Router } = require("express");
const route = Router();
const auth = require("../middlewares/auth");
const projectController = require("../controllers/projectController");

route.post("/api/new-project", auth, projectController.newProj);
route.delete("/api/remove-project/:id", auth, projectController.removeProj);
route.patch(
  "/api/add-volunteer/:id",
  auth,
  projectController.addVolunteerProjects
);
route.patch(
  "/api/remove-volunteer/:id",
  auth,
  projectController.removeVolunteerProjects
);

route.patch("/api/update-project/:id", auth, projectController.updateProj);
route.patch("/api/update-status/:id", auth, projectController.updateStatus);

route.post("/api/new-badge", auth, projectController.addBadge);
route.patch("/api/give-badge/:id", auth, projectController.updateUserBadge);

module.exports = route;
