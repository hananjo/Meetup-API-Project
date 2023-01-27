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

  async (req, res) => {
    let { page, size, name, type, startDate } = req.query;
    let errors = {};

    if (page < 1 || page > 10) {
      errors.page = "Page must be greater than or equal to 1";
    }
    if (size < 1 || size > 20) {
      errors.size = "Size must be greater than or equal to 1";
    }
    if (typeof name !== "string" && name !== undefined) {
      errors.name = "Name must be a string";
    }
    if (type !== "Online" && type !== "In Person" && type !== undefined) {
      errors.type = "Type must be 'Online' or 'In Person'";
    }
    if (!(startDate instanceof Date) && startDate !== undefined) {
      errors.startDate = "Start date must be a valid datetime";
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: "Validation error",
        statusCode: 400,
        errors,
      });
    }

    const where = {};
    if (!page) {
      // page = Number(page);
      page = 1;
      // where.page = 1;
    }
    if (!size) {
      // size = Number(size);
      size = 20;
      // where.size = 20;
    }
    let limit = size;
    let offset = size * (page - 1);
    if (name) {
      where.name = name;
    }
    if (type) {
      where.type = type;
    }
    if (startDate) {
      where.startDate = startDate;
    }
    // console.log(page, size, where);

    const events = await Event.findAll({
      limit: limit,
      offset: offset,

      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        // { model: EventImage, attributes: ["previewImage"] },
        { model: Group, attributes: ["id", "name", "city", "state"] },
        { model: Venue, attributes: ["id", "city", "state"] },
      ],
      where: { ...where },
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
  // const member = await Membership.findOne({
  //   where: { memberId: req.body.memberId, groupId: event.groupId },
  // });

  const attendee = await Attendee.findAll({
    where: {
      // userId: req.user.id,
      eventId: req.params.eventId,
    },
  });
  console.log(attendee);
  const resObj = { Attendees: [] };
  for await (let oneOfAttendee of attendee) {
    const user = await User.findOne({
      where: { id: oneOfAttendee.userId },
    });
    const userObj = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      Attendance: { status: oneOfAttendee.status },
    };
    resObj.Attendees.push(userObj);
    // console.log(user);
  }
  // console.log(req.user.id);
  // if (req.user) {
  //   // console.log(attendee.userId, group.organizerId);

  //   if (
  //     group.organizerId === attendee.userId ||
  //     attendee.status === "Co-host"
  //   ) {
  //     let attendees = await User.findAll({
  //       attributes: ["id", "firstName", "lastName"],
  //       include: {
  //         model: Attendee,
  //         where: { eventId: req.params.eventId },
  //         attributes: ["status"],
  //       },
  //     });
  //     return res.json({ Attendees: attendees });
  //   } else {
  //     let attendees = await User.findAll({
  //       attributes: ["id", "firstName", "lastName"],
  //       include: {
  //         model: Attendee,
  //         through: { where: { eventId: req.params.eventId } },
  //         attributes: ["status"],
  //       },
  //     });
  return res.json(resObj);
  // }
  // }
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
      groupId: event.groupId,
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
  const { userId, status } = req.body;
  const event = await Event.findByPk(req.params.eventId);
  const group = await Group.findByPk(event.groupId);
  const attendance = await Attendee.findOne({
    where: {
      userId: req.body.userId,
      eventId: req.params.eventId,
    },
  });
  // console.log(event, group);
  console.log(attendance);
  // const attendance = await Attendee.findOne({
  //   where: { userId: req.user.id, eventId: req.params.eventId },
  // });

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
    if (req.body.userId === group.dataValues.organizerId) {
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
    if (req.body.userId === group.dataValues.organizerId) {
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
  console.log(attendance);
  const returnObj = {
    id: attendance.id,
    userId: attendance.userId,
    eventId: attendance.eventId,
    status: attendance.status,
  };
  res.json(returnObj);
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
      memberId: req.user.id,
      groupId: deleteEvent.dataValues.groupId,
    },
  });

  if (
    //   member.status === "Co-host"
    //  ||
    req.user.id === group.organizerId
  ) {
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
    where: { userId: req.body.userId, eventId: req.params.eventId },
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
