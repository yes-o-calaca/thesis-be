const Organization = require("../models/organizationModel");

const organizationController = {
  newOrg: async (req, res) => {
    try {
      const {
        org_year,
        president,
        vicepresident,
        secretary,
        treasurer,
        auditor,
        public_information_officer_1,
        public_information_officer_2,
        protocol_officer_1,
        protocol_officer_2,
        water_division_commitee_1,
        water_division_commitee_2,
        water_division_commitee_3,
        water_division_commitee_4,
        land_division_commitee_1,
        land_division_commitee_2,
        land_division_commitee_3,
        land_division_commitee_4,
        fire_division_commitee_1,
        fire_division_commitee_2,
        fire_division_commitee_3,
        fire_division_commitee_4,
        air_division_commitee_1,
        air_division_commitee_2,
        air_division_commitee_3,
        air_division_commitee_4,
      } = req.body;

      console.log(org_year);

      const sk = await Organization.findOne({ org_year });
      if (sk)
        return res.status(400).json({ msg: "Organization this Year Exist" });

      const newOrg = new Organization({
        org_year,
        president,
        vicepresident,
        secretary,
        treasurer,
        auditor,
        public_information_officer_1,
        public_information_officer_2,
        protocol_officer_1,
        protocol_officer_2,
        water_division_commitee_1,
        water_division_commitee_2,
        water_division_commitee_3,
        water_division_commitee_4,
        land_division_commitee_1,
        land_division_commitee_2,
        land_division_commitee_3,
        land_division_commitee_4,
        fire_division_commitee_1,
        fire_division_commitee_2,
        fire_division_commitee_3,
        fire_division_commitee_4,
        air_division_commitee_1,
        air_division_commitee_2,
        air_division_commitee_3,
        air_division_commitee_4,
      });

      await newOrg.save();
      //scucess
      res.status(200).json({ msg: "Organization Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  //   removeProj: async (req, res) => {
  //     try {
  //       await Project.findByIdAndRemove(req.params.id);
  //       return res.status(200).json({ success: true });
  //     } catch (error) {
  //       return res.status(400).json({ success: false });
  //     }
  //   },

  getOrg: async () => {
    try {
      const allOrg = await Organization.find()
        ?.populate("president")
        ?.populate("vicepresident")
        ?.populate("secretary")
        ?.populate("treasurer")
        ?.populate("auditor")
        ?.populate("public_information_officer_1")
        ?.populate("public_information_officer_2")
        ?.populate("protocol_officer_1")
        ?.populate("protocol_officer_2")
        ?.populate("water_division_commitee_1")
        ?.populate("water_division_commitee_2")
        ?.populate("water_division_commitee_3")
        ?.populate("water_division_commitee_4")
        ?.populate("land_division_commitee_1")
        ?.populate("land_division_commitee_2")
        ?.populate("land_division_commitee_3")
        ?.populate("land_division_commitee_4")
        ?.populate("fire_division_commitee_1")
        ?.populate("fire_division_commitee_2")
        ?.populate("fire_division_commitee_3")
        ?.populate("fire_division_commitee_4")
        ?.populate("air_division_commitee_1")
        ?.populate("air_division_commitee_2")
        ?.populate("air_division_commitee_3")
        ?.populate("air_division_commitee_4");

      return allOrg;
    } catch (error) {
      return error;
    }
  },
};
module.exports = organizationController;
