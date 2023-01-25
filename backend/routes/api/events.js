const express = require("express");

const { requireAuth } = require("../../utils/auth");
const {
  Event,
  Group,
  Venue,
  EventImage,
  Attendee,
} = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { route } = require("./session");
const group = require("../../db/models/group");

const router = express.Router();

const validateEvent = [
  check("venue_id")
    .exists({ checkFalsy: true })
    .withMessage("Venue does not exist"),
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["In person", "Online"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("capacity")
    .isNumeric({ min: 1 })
    .withMessage("Capacity must be an integer"),
  check("price").isDecimal({ min: 1 }).withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate").isAfter().withMessage("Start date must be in the future"),
  check("endDate").custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startDate)) {
      throw new Error("End date is less than start date");
    }
  }),
  handleValidationErrors,
];
//Get all Events
router.get("/", async (req, res) => {
  const events = await Event.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      // { model: EventImage, attributes: ["previewImage"] },
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
  });
  for await (let event of events) {
    // console.log(event);
    const attending = await Attendee.findAll({
      where: { event_id: event.dataValues.id },
    });

    // console.log(attending.length);
    event.dataValues.numAttending = attending.length;

    const image = await EventImage.findOne({
      where: { preview: true, event_id: event.dataValues.id },
    });
    event.dataValues.preview = image.url;
  }
  res.json({ Events: events });
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
      { model: EventImage, attributes: ["id", "url", "preview"] },
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
// router.get("/:eventId/attendees", async (req, res) => {
//   const event = await Event.findByPk(req.params.eventId, {
//     include: {
//       model: Attendee,
//       attributes: ["userId"],
//     },
//   });
//   if (!event) {
//     res.status(404).json({
//       message: "Event couldn't be found",
//       statusCode: 404,
//     });
//   }
//   res.json(event);
// });

//Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }

  // if(req.user.id === event.)

  const newImage = await EventImage.create({
    event_id: req.params.eventId,
    url,
    preview,
  });
  const returnObj = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };
  res.json(returnObj);
});
//Edit an Event specified by its id
router.put("/:eventId", requireAuth, validateEvent, async (req, res) => {
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

  // if(req.user.id === event.group.organizerId || member.status === 'Co-Host')
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
