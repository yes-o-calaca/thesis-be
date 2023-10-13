const { Router } = require("express");
const route = Router();
const auth = require("../middlewares/auth");
const organizationController = require("../controllers/organizationController");

route.post("/api/new-org", auth, organizationController.newOrg);
//route.delete("/api/remove-project/:id", auth, projectController.removeProj);

module.exports = route;
