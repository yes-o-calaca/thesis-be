const cors = require("cors");
const bodyparser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

const uploadRoutes = require("./routes/uploadRoutes");
const projectRoutes = require("./routes/projectRoutes");
const settingRoutes = require("./routes/settingsRoutes");
const virtualRoutes = require("./routes/virtualPostRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const awardRoutes = require("./routes/awardRoutes");

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const userController = require("./controllers/userController");
const skillController = require("./controllers/skillController");
const settingController = require("./controllers/settingController");
const projectController = require("./controllers/projectController");
const virtualPostController = require("./controllers/virtualPostController");
const organizationController = require("./controllers/organizationController");
const awardController = require("./controllers/awardController");
const paymentController = require("./controllers/paymentController");

const app = express();
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(bodyparser.json());

const corsOptions = {
  origin: "https://yes-o-calaca.onrender.com",
};

// Create the HTTP server and socket.io instance
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOptions,
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");

    // app.use(express.static("client/build"));
    // app.get("*", (req, res) =>
    //   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    // );

    // app.use(express.static("client/build"));

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("getAllUser", async () => {
        try {
          const allUser = await userController.getAllUser();
          socket.emit("getAllUserSuccess", { allUser });
        } catch (error) {
          socket.emit("getAllUserError", { error });
        }
      });

      socket.on("getAllSkill", async () => {
        try {
          const allSkill = await skillController.getSkill();
          socket.emit("getAllSkillSuccess", { allSkill });
        } catch (error) {
          socket.emit("getAllSkillError", { error });
        }
      });

      socket.on("getAllLogo", async () => {
        try {
          const allLogo = await settingController.getLogo();
          socket.emit("getAllLogoSuccess", { allLogo });
        } catch (error) {
          socket.emit("getAllLogoError", { error });
        }
      });

      socket.on("getAllProjects", async () => {
        try {
          const allProject = await projectController.getPost();
          socket.emit("getAllProjectSuccess", { allProject });
        } catch (error) {
          socket.emit("getAllProjectError", { error });
        }
      });

      socket.on("getAllVirtualPost", async () => {
        try {
          const allVPost = await virtualPostController.getVirtualPost();
          socket.emit("getAllVirtualPostSuccess", { allVPost });
        } catch (error) {
          socket.emit("getAllVirtualPostError", { error });
        }
      });

      socket.on("getAllOrganization", async () => {
        try {
          const allOrg = await organizationController.getOrg();
          socket.emit("getAllOrganizationSuccess", { allOrg });
        } catch (error) {
          socket.emit("getAllOrganizationError", { error });
        }
      });

      socket.on("getAllAwards", async () => {
        try {
          const allAward = await awardController.getAward();
          socket.emit("getAllAwardsSuccess", { allAward });
        } catch (error) {
          socket.emit("getAllAwardsError", { error });
        }
      });

      socket.on("getPayment", async () => {
        try {
          const allPayment = await paymentController.getPayment();
          socket.emit("getAllPaymentSuccess", { allPayment });
        } catch (error) {
          socket.emit("getAllPaymentError", { error });
        }
      });

      socket.on("getDonation", async () => {
        try {
          const allDonation = await paymentController.getDonation();
          socket.emit("getDonationSuccess", { allDonation });
        } catch (error) {
          socket.emit("getDonationSuccess", { error });
        }
      });
    });

    server.listen(process.env.PORT || 3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(userRoutes);
app.use(uploadRoutes);
app.use(projectRoutes);
app.use(settingRoutes);
app.use(virtualRoutes);
app.use(organizationRoutes);
app.use(awardRoutes);
app.use("/uploads", express.static("uploads"));
