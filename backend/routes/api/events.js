const express = require("express");

const { requireAuth } = require("../../utils/auth");
const {
  Event,
  Group,
  Venue,
  EventImage,
  Attendee,
  Membership,
} = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { route } = require("./session");
const group = require("../../db/models/group");

const router = express.Router();

const validateEvent = [
  check("venueId")
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
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("End date is less than start date"),

  // .custom((value, { req }) => {
  //   if (new Date(value) <= new Date(req.body.startDate)) {
  //     throw new Error("End date is less than start date");
  //   }
  // }),
  // .withMessage("End date is less than start date")

  // check("endDate")
  //   .isAfter(check("startDate"))
  //   .withMessage("End date is less than start date"),

  // .if(endDate.value.Date(be specific) < startDate.Date())
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
  // console.log(events);
  for await (let event of events) {
    // console.log(event.dataValues.id);
    const attending = await Attendee.findAll({
      where: { eventId: event.dataValues.id },
    });
    // console.log(attending);
    // console.log(attending.length);
    event.dataValues.numAttending = attending.length;

    const image = await EventImage.findOne({
      where: { preview: true, eventId: event.dataValues.id },
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
    return res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }

  // console.log(event.dataValues.id);
  const attending = await Attendee.findAll({
    where: { eventId: event.id },
  });
  console.log(attending);
  // console.log(attending.length);
  event.dataValues.numAttending = attending.length;

  res.json(event);
});

//Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    return res.status(404).json({
      message: "Forbidden",
      statusCode: 404,
    });
  }

  const group = await Group.findByPk(event.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: event.groupId },
  });

  if (req.user) {
    if (group.organizerId === req.user.id || member.status === "Co-Host") {
      let attendees = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: {
          model: Attendee,
          where: { eventId: req.params.eventId },
          attributes: ["status"],
        },
      });
      return res.json({ Attendees: attendees });
    }
  } else {
    let attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendee,
        where: { eventId: req.params.eventId },
        attributes: ["status"],
      },
    });
    return res.json({ Attendees: attendees });
  }
});

//Request to Attend an Event based on the Event's id
router.post("/:eventId/attandence", requireAuth, async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  // const group = await Group.findByPk(event.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: event.groupId },
  });

  if (!event) {
    return res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }

  if (member.status === "Pending") {
    res.status(400).json({
      message: "Attendance has already been requested",
      statusCode: 400,
    });
  }
  if (member.status === "Member") {
    res.status(400).json({
      message: "User is already an attendee of the event",
      statusCode: 400,
    });
  }
  const newAttendee = await Attendee.create({
    eventId: req.params.eventId,
    userId: req.user.id,
    status: "Pending",
  });
  res.json(newAttendee);
});

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
    eventId: req.params.eventId,
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
    venueId,
    name,
    about,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  } = req.body;
  if (!event) {
    return res.status(404).json({
      message: "Venue couldn't be found",
      statusCode: 404,
    });
  }

  const group = await Group.findByPk(event.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: event.groupId },
  });

  if (member.status === "Co-Host" || req.user.id === group.organizerId) {
    event.set({
      venueId,
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

    const returnObj = {
      id: event.id,
      venueId: event.venueId,
      name: event.name,
      about: event.about,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    };
    return res.json(returnObj);
  } else {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//Change the status of an attendance for an event specified by id
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  const group = await Group.findByPk(event.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: event.groupId },
  });

  const attendance = await Attendee.findOne({
    where: { userId: req.user.id, eventId: req.params.eventId },
  });
  const { userId, status } = req.body;
  if (!event) {
    return res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }
  if (!attendance) {
    return res.status(404).json({
      message: "Attendance between the user and event does not exist",
      statusCode: 404,
    });
  }
  if (!attendance.userId) {
    return res.status(400).json({
      message: "Cannot change an attendance status to pending",
      statusCode: 400,
    });
  }

  if (member.status === "Member") {
    if (req.user.id === group.dataValues.organizerId) {
      attendance.set({
        status,
      });
      await attendance.save();
    } else {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }

  if (member.status === "Co-Host") {
    if (req.user.id === group.dataValues.organizerId) {
      attendance.set({
        status,
      });
      await attendance.save();
    } else {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }

  res.json(attendance);
});

//Delete an Event specified by its id
router.delete("/:eventId", requireAuth, async (req, res) => {
  const deleteEvent = await Event.findByPk(req.params.eventId);

  if (!deleteEvent) {
    return res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }

  const group = await Group.findByPk(deleteEvent.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: deleteEvent.groupId },
  });

  if (member.status === "Co-Host" || req.user.id === group.organizerId) {
    await deleteEvent.destroy();
    res.json({
      message: "Successfully deleted",
    });
  } else {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//Delete attendance to an event specified by id
router.delete("/:eventId/attendance", requireAuth, async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  const attendance = await Attendee.findOne({
    where: { userId: req.user.id, eventId: req.params.eventId },
  });
  const group = await Group.findByPk(event.groupId);

  if (!event) {
    return res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }

  if (!attendance) {
    return res.status(404).json({
      message: "Attendance does not exist for this User",
      statusCode: 404,
    });
  }
  if (!req.user.id || !group.organizerId) {
    return res.status(403).json({
      message: "Only the User or organizer may delete an Attendance",
      statusCode: 403,
    });
  } else {
    await attendance.destroy();
    res.json({
      message: "Successfully deleted attendance from event",
    });
  }
});

module.exports = router;
