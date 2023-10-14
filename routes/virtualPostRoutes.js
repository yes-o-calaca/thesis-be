const { Router } = require("express");
const route = Router();
const auth = require("../middlewares/auth");
const virtualPostController = require("../controllers/virtualPostController");

route.post("/api/new-virtual-post", auth, virtualPostController.newVirtualPost);
route.patch(
  "/api/new-info-post/:id",
  auth,
  virtualPostController.newVirtualPostInformation
);
route.delete(
  "/api/auth/remove-vpost/:id",
  auth,
  virtualPostController.removeVirtualPost
);

route.get("/api/v-post-info", auth, virtualPostController.getVirtualPostSingle);

route.patch(
  "/api/update-info-post/:id",
  auth,
  virtualPostController.updateVirtualPostSingle
);
route.delete(
  "/api/auth/remove-vpost-details/:id",
  auth,
  virtualPostController.removeVirtualPostInformation
);

module.exports = route;
