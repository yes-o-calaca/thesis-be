var mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
    },
    middle_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      min: 8,
    },
    contact: {
      type: String,
    },
    address: {
      type: String,
    },
    bday: {
      type: Date,
    },
    skills: [{ type: mongoose.Schema.ObjectId, ref: "Skill" }],
    gender: {
      type: String,
    },
    age: { type: String },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    created: {
      type: Date,
      default: Date.now(),
    },
    lastlogin: {
      type: Array,
      default: [],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("User", userSchema);
