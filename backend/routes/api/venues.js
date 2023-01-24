const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { Group, Venue } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { route } = require("./session");

const router = express.Router();
const validateVenue = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("lat").isDecimal().withMessage("Latitude is not valid"),
  check("lng").isDecimal().withMessage("Longitude is not valid"),
  handleValidationErrors,
];

// router.get("/", async (req, res) => {
//   const venue = Venue.findAll({});
//   res.json(venue);
// });
router.put("/:venueId", requireAuth, validateVenue, async (req, res) => {
  const venue = await Venue.findByPk(req.params.venueId);
  const { address, city, state, lat, lng } = req.body;
  if (!venue) {
    res.status(404).json({
      message: "Venue couldn't be found",
      statusCode: 404,
    });
  }

  if (!venue) {
    res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: [
        "Street address is required",
        "City is required",
        "State is required",
        "Latitude is not valid",
        "Longitude is not valid",
      ],
    });
  }
  venue.set({ address, city, state, lat, lng });
  await venue.save();

  return res.json(venue);
});

module.exports = router;
