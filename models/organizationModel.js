var mongoose = require("mongoose");
const orgSchema = new mongoose.Schema({
  org_year: {
    type: String,
  },
  adviser: { type: mongoose.Schema.ObjectId, ref: "User" },
  president: { type: mongoose.Schema.ObjectId, ref: "User" },
  vicepresident: { type: mongoose.Schema.ObjectId, ref: "User" },
  secretary: { type: mongoose.Schema.ObjectId, ref: "User" },
  treasurer: { type: mongoose.Schema.ObjectId, ref: "User" },
  auditor: { type: mongoose.Schema.ObjectId, ref: "User" },
  public_information_officer_1: { type: mongoose.Schema.ObjectId, ref: "User" },
  public_information_officer_2: { type: mongoose.Schema.ObjectId, ref: "User" },
  protocol_officer_1: { type: mongoose.Schema.ObjectId, ref: "User" },
  protocol_officer_2: { type: mongoose.Schema.ObjectId, ref: "User" },
  water_division_commitee_1: { type: mongoose.Schema.ObjectId, ref: "User" },
  water_division_commitee_2: { type: mongoose.Schema.ObjectId, ref: "User" },
  water_division_commitee_3: { type: mongoose.Schema.ObjectId, ref: "User" },
  water_division_commitee_4: { type: mongoose.Schema.ObjectId, ref: "User" },
  land_division_commitee_1: { type: mongoose.Schema.ObjectId, ref: "User" },
  land_division_commitee_2: { type: mongoose.Schema.ObjectId, ref: "User" },
  land_division_commitee_3: { type: mongoose.Schema.ObjectId, ref: "User" },
  land_division_commitee_4: { type: mongoose.Schema.ObjectId, ref: "User" },
  fire_division_commitee_1: { type: mongoose.Schema.ObjectId, ref: "User" },
  fire_division_commitee_2: { type: mongoose.Schema.ObjectId, ref: "User" },
  fire_division_commitee_3: { type: mongoose.Schema.ObjectId, ref: "User" },
  fire_division_commitee_4: { type: mongoose.Schema.ObjectId, ref: "User" },
  air_division_commitee_1: { type: mongoose.Schema.ObjectId, ref: "User" },
  air_division_commitee_2: { type: mongoose.Schema.ObjectId, ref: "User" },
  air_division_commitee_3: { type: mongoose.Schema.ObjectId, ref: "User" },
  air_division_commitee_4: { type: mongoose.Schema.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Organization", orgSchema);
