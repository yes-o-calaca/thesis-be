const { Router } = require("express");
const route = Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const skillController = require("../controllers/skillController");

route.post("/api/auth/register", userController.register);
route.post("/api/auth/register-many", userController.registerMany);
route.post("/api/auth/login", userController.login);
route.post("/api/auth/access", userController.access);
route.delete("/api/auth/remove/:id", auth, userController.remove);
route.patch("/api/auth/update/:id", auth, userController.update_role);
route.get("/api/auth/user", auth, userController.info);
route.post("/api/auth/activate", userController.activate);
route.post("/api/auth/forgot_pass", userController.forgot);
route.patch("/api/auth/reset_pass", auth, userController.reset);
route.get("/api/auth/signout", userController.signout);
route.patch("/api/auth/update-ic", auth, userController.update_profile_pic);

//for skills
route.post("/api/auth/add-skill", auth, skillController.newSkill);
route.delete("/api/auth/remove-skill/:id", auth, skillController.removeSkill);
route.patch("/api/auth/update-skill/:id", auth, skillController.updateSkill);
route.patch("/api/auth/update-skill-user", auth, userController.update_skill);
route.patch(
  "/api/auth/remove-skill-user/:id",
  auth,
  userController.remove_skill
);

module.exports = route;
