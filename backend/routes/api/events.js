const express = require("express");

const { requireAuth } = require("../../utils/auth");
const {
  Event,
  Group,
  Venue,
  EventImage,
  Attendee,
  Membership,
  User,
} = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { route } = require("./session");
const group = require("../../db/models/group");

const router = express.Router();

// const validateQueryParam = [
//   check("page")
//     // .isGreaterThanOrEqual(0)
//     .withMessage("Page must be greater than or equal to 0"),
//   check("size")
//     // .isGreaterThanOrEqual(0)
//     .withMessage("Size must be greater than or equal to 0"),
//   check("name").isString().withMessage("Name must be a string"),
//   check("type")
//     .exists({ checkFalsy: true })
//     .isIn(["In person", "Online"])
//     .withMessage("Type must be 'Online' or 'In person'"),
//   check(
//     "startDate".isDate().withMessage("Start date must be a valid datetime")
//   ),
//   handleValidationErrors,
// ];

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
router.get(
  "/",
  // validateQueryParam,
  async (req, res) => {
    const { page, size, name, type, startDate } = req.query;
    const where = {};
    if (!page) where.page = 0;
    if (!size) where.size = 20;
    if (name) where.name = name;
    if (type) where.type = type;
    if (startDate) where.startDate = startDate;

    const events = await Event.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        // { model: EventImage, attributes: ["previewImage"] },
        { model: Group, attributes: ["id", "name", "city", "state"] },
        { model: Venue, attributes: ["id", "city", "state"] },
      ],
      where,
      limit: size,
      offset: size * (page - 1),
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
  }
);

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
    where: { memberId: req.user.id, groupId: event.groupId },
  });

  if (req.user) {
    if (group.organizerId === req.user.id || member.status === "Co-host") {
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
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  const event = await Event.findByPk(req.params.eventId);
  // const group = await Group.findByPk(event.groupId);
  const attendance = await Attendee.findOne({
    where: { userId: req.user.id, eventId: req.params.eventId },
  });
  // console.log(attendance.userId);
  if (!event) {
    return res.status(404).json({
      message: "Event couldn't be found",
      statusCode: 404,
    });
  }
  if (attendance) {
    if (attendance.status === "Pending") {
      return res.status(400).json({
        message: "Attendance has already been requested",
        statusCode: 400,
      });
    }

    if (attendance.status === "Member") {
      return res.status(400).json({
        message: "User is already an attendee of the event",
        statusCode: 400,
      });
    }
  }
  const newAttendee = await Attendee.create({
    eventId: req.params.eventId,
    userId: req.user.id,
    status: "Pending",
  });
  const returnObj = {
    eventId: newAttendee.eventId,
    userId: newAttendee.userId,
    status: newAttendee.status,
  };

  return res.json(returnObj);
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
    where: { memberId: req.user.id, groupId: event.groupId },
  });

  if (
    // member.status === "Co-host" ||
    req.user.id === group.organizerId
  ) {
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
  const attendance = await Attendee.findOne({
    where: { userId: req.body.userId, eventId: req.params.eventId },
  });

  // const attendance = await Attendee.findOne({
  //   where: { userId: req.user.id, eventId: req.params.eventId },
  // });
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

  if (status === "Member") {
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

  if (status === "Co-host") {
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
    where: {
      memberId: req.body.memberId,
      groupId: deleteEvent.dataValues.groupId,
    },
  });

  if (member.status === "Co-host" || req.user.id === group.organizerId) {
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
    where: { userId: req.body.id, eventId: req.params.eventId },
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
