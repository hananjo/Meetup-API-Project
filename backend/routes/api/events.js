const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { Event, Group, Venue, EventImage } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { route } = require("./session");
const group = require("../../db/models/group");

const router = express.Router();

// const validateEvent = [
//     check("venue_id")
//       .exists({ checkFalsy: true })
//       .withMessage("Venue does not exist"),
//     check("name")
//       .isLength({ min: 5 })
//       .withMessage("Name must be at least 5 characters"),
//     check("type")
//       .exists({ checkFalsy: true })
//       .isIn(["In-Person", "Online"])
//       .withMessage("Type must be 'Online' or 'In-Person'"),
//     check("capacity").isNumeric().withMessage("Capacity must be an integer"),
//     check("price").isDecimal().withMessage("Price is invalid"),
//     check("description").exists({checkFalsy: true}).withMessage("Description is required"),
//     check("startDate").isAfter().withMessage("Start date must be in the future"),
//     check("endDate").withMessage("End date is less than start date"),
//     handleValidationErrors,
//   ];

//Get all Events
router.get("/", async (req, res) => {
  const events = await Event.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      { model: EventImage, attributes: ["previewImage"] },
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
  });
  res.json(events);
});

//Get details of an Event specified by its id

router.get("/:eventId", async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      { model: Group, attributes: ["id", "name", "private", "city", "state"] },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
      { model: EventImage, attributes: ["id", "url", "previewImage"] },
    ],
  });
  if (!event) {
    res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  } else {
    res.json(event);
  }
});

//Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: {
      model: Attendee,
      attributes: ["user_id"],
    },
  });
  if (!event) {
    res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }
  res.json(event);
});

//Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res) => {
  const { url, previewImage } = req.body;
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }

  const newImage = await EventImage.create({
    event_id: req.params.eventId,
    url,
    previewImage,
  });
  res.json(newImage);
});
//Edit an Event specified by its id
router.put("/:eventId", requireAuth, async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  const {
    venue_id,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  } = req.body;
  if (!event) {
    res.status(404).json({
      message: "Venue couldn't be found",
      statusCode: 404,
    });
  }

  if (!event) {
    res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors: [
        "Venue does not exist",
        "Name must be at least 5 characters",
        "Type must be 'Online' or 'In person'",
        "Capacity must be an integer",
        "Price is invalid",
        "Description is required",
        "Start date must be in the future",
        "End date is less than start date",
      ],
    });
  }
  event.set({
    venue_id,
    name,
    about,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  });
  await event.save();

  return res.json(event);
});

//Delete an Event specified by its id
router.delete("/:eventId", requireAuth, async (req, res) => {
  const deleteEvent = await Event.findByPk(req.params.eventId);

  if (!deleteEvent) {
    res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }
  await deleteEvent.destroy();
  res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
