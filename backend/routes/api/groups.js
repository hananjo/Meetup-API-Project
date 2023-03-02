const express = require("express");

const { requireAuth } = require("../../utils/auth");
const {
  Group,
  Event,
  GroupImage,
  User,
  Venue,
  Membership,
  Attendee,
  EventImage,
} = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const group = require("../../db/models/group");
const e = require("express");

const router = express.Router();

const validateInfo = [
  check("name")
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["In person", "Online"])
    .withMessage('Type must be "Online" or "In person"'),
  check("private")
    .not()
    .isString()
    .not()
    .isNumeric()
    .notEmpty()
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  handleValidationErrors,
];

const validateVenue = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("lat").isDecimal().withMessage("Latitude is not valid"),
  check("lng").isDecimal().withMessage("Longitude is not valid"),
  handleValidationErrors,
];

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
// const validateLogin = [
//   check("credential")
//     .exists({ checkFalsy: true })
//     .notEmpty()
//     .withMessage("Please provide a valid email or username."),
//   check("password")
//     .exists({ checkFalsy: true })
//     .withMessage("Please provide a password."),
//   handleValidationErrors,
// ];

// const validateSignup = [
//   check("email")
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage("Please provide a valid email."),
//   check("username")
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage("Please provide a username with at least 4 characters."),
//   check("username").not().isEmail().withMessage("Username cannot be an email."),
//   check("password")
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage("Password must be 6 characters or more."),
//   handleValidationErrors,
// ];

//Get all Groups
router.get("/", async (req, res) => {
  // console.log("hello");
  const groups = await Group.findAll({});
  for await (let group of groups) {
    // console.log(group);
    const members = await Membership.findAll({
      where: { groupId: group.dataValues.id },
    });

    // console.log(members.length);
    group.dataValues.numMembers = members.length;

    const image = await GroupImage.findOne({
      where: { preview: true, groupId: group.dataValues.id },
    });
    group.dataValues.preview = image.url;
  }

  res.json({ Groups: groups });
});

//Get all Groups joined or Organized by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const groups = await Group.findAll({
    // include: [
    //   {
    //     model: Event,
    //     // as: "capacity",
    //     attributes: ["capacity"],
    //   },
    //   {
    //     model: GroupImage,
    //     // as: "previewImage",
    //     attributes: ["previewImage"],
    //   },
    // ],
    where: [{ organizerId: req.user.id }],
    // attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  for await (let group of groups) {
    // console.log(group);
    const members = await Membership.findAll({
      where: { groupId: group.dataValues.id },
    });
    // console.log(members.length);
    group.dataValues.numMembers = members.length;

    const image = await GroupImage.findOne({
      where: { preview: true, groupId: group.dataValues.id },
    });
    group.dataValues.preview = image.url;
  }

  res.json({ Groups: groups });
});

// Get details of a Group from an id
router.get("/:groupId", async (req, res) => {
  console.log(req.params.groupId);
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Organizer",
        attributes: ["id", "firstName", "lastName"],
      },

      {
        model: Venue,
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
      },
    ],
  });
  if (!group) {
    res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  } else {
    const members = await Membership.findAll({
      where: { groupId: group.dataValues.id },
    });
    console.log(group.dataValues);
    // console.log(members.length);
    group.dataValues.numMembers = members.length;
    res.json(group);
  }
});

// Get all Members of a Group specified by its id
router.get("/:groupId/members", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  const loggedInMember = await Membership.findOne({
    where: { memberId: req.user.id, groupId: req.params.groupId },
    //as long as the userId from members matches the logged in user and the groupId
    //from the members is the groupId from the params entered in
  });
  if (!group) {
    res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  if (!loggedInMember) {
    //if no logged in member/user then you want to grab all the members from the group that
    //groupId matches
    let groupMembers = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: { model: Membership, where: { groupId: req.params.groupId } },
      //want to grab the mmeber where groupId matches the params
    });
    const memberArray = [];
    groupMembers.forEach((member) => {
      const memberObj = {};

      console.log(member.Memberships);
      memberObj.id = member.id;
      memberObj.firstName = member.firstName;
      memberObj.lastName = member.lastName;

      memberObj.Membership = { status: member.Memberships[0].status };
      memberArray.push(memberObj);
    });

    return res.json({ Members: memberArray });
  }
  if (req.user) {
    if (
      group.organizerId === req.user.id ||
      loggedInMember.status === "Co-host"
    ) {
      let groupMembers = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: {
          model: Membership,
          where: { groupId: req.params.groupId },
          //where groupId matches the member, where group Id is coming from our params

          attributes: ["status"],
        },
      });
      const memberArray = [];
      groupMembers.forEach((member) => {
        const memberObj = {};
        memberObj.id = member.userId;
        memberObj.firstName = member.firstName;
        memberObj.lastName = member.lastName;
        memberObj.Membership = { status: member.Memberships[0].status };
        memberArray.push(memberObj);
      });

      return res.json({ Members: memberArray });
    }
  } else {
    let groupMembers = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        where: { groupId: req.params.groupId },
        attributes: ["status"],
      },
    });
    const memberArray = [];
    groupMembers.forEach((member) => {
      const memberObj = {};
      memberObj.id = member.userId;
      memberObj.firstName = member.firstName;
      memberObj.lastName = member.lastName;
      memberObj.Membership = { status: member.Memberships[0].status };
      memberArray.push(memberObj);
    });

    return res.json({ Members: memberArray });
  }
});

//Get all Events of a Group specified by its id
router.get("/:groupId/events", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: Event,
        attributes: [
          "id",
          "groupId",
          "venueId",
          "name",
          "type",
          "startDate",
          "endDate",
        ],
        include: [
          { model: Group, attributes: ["id", "name", "city", "state"] },
          { model: Venue, attributes: ["id", "city", "state"] },
          // { model: EventImage },
        ],
      },
    ],
  });
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  for await (let event of group.Events) {
    // console.log(event.dataValues.id);
    const attending = await Attendee.findAll({
      where: { eventId: event.dataValues.id },
    });
    // console.log(attending);
    // console.log(attending.length);
    event.dataValues.numAttending = attending.length;

    const image = await EventImage.findOne({
      where: {
        preview: true,
        eventId: event.dataValues.id,
      },
    });
    if (image) {
      console.log(image.eventId);
      event.dataValues.preview = image.url;
    } else {
      event.dataValues.preview = null;
    }
  }

  res.json({ Events: group.Events });
});

//Get all Venues for a Group specified by its id
router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: {
      model: Venue,
      //   attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  const member = await Membership.findOne({
    where: { memberId: req.user.id, groupId: req.params.groupId },
    //user in the member matches the req user id from the groupId input in the url, want to see if user
    // is associated with groupId input
  });

  if (
    // member.status === "Co-host" ||
    req.user.id === group.organizerId
  ) {
    return res.json({ Venues: group.Venues });
  } else {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//Create a Group
router.post("/", requireAuth, validateInfo, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const newGroup = await Group.create({
    name,
    about,
    type,
    private,
    city,
    state,
    organizerId: req.user.id,
  });
  // if (newGroup) {
  //   const newMembership = await Membership.create({
  //     groupId: newGroup.id,
  //     userId: req.user.id,
  //     status: "Member",
  //   });
  // console.log(newMembership);
  // }
  // if (!newGroup) {
  //   res.status(400).json({
  //     message: "Validation Error",
  //     statusCode: 400,
  //     errors: [
  //       "Name must be 60 characters or less",
  //       "About must be 50 characters or more",
  //       "Type must be 'Online' or 'In person'",
  //       "Private must be a boolean",
  //       "City is required",
  //       "State is required",
  //     ],
  //   });
  // }

  res.json(newGroup);
});

// Create an Event for a Group specified by its id
router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    const member = await Membership.findOne({
      where: { memberId: req.user.id, groupId: req.params.groupId },
    });
    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404,
      });
    }

    if (req.user.id === group.organizerId || member.status === "Co-Host") {
      const {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      } = req.body;

      const newEvent = await Event.create({
        groupId: req.params.groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });

      const returnObj = {
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
      };

      res.json(returnObj);
    }
  }
);

//Request a Membership for a Group based on Group's id
router.post("/:groupId/membership", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  const Member = await Membership.findOne({
    where: { memberId: req.user.id, groupId: req.params.groupId },
  });

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  if (Member) {
    if (Member.status === "Pending") {
      return res.status(400).json({
        message: "Membership has already been requested",
        statusCode: 400,
      });
    }
    if (Member.status === "Member") {
      return res.status(400).json({
        message: "User is already a member of the group",
        statusCode: 400,
      });
    }
  }

  const newMember = await Membership.create({
    groupId: req.params.groupId,
    memberId: req.user.id,
    status: "Pending",
  });
  const returnObj = {
    groupId: newMember.groupId,
    memberId: newMember.memberId,
    status: newMember.status,
  };
  res.json(returnObj);
});
//Create a new Venue for a Group specified by its id
router.post(
  "/:groupId/venues",
  requireAuth,
  validateVenue,
  async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    const { address, city, state, lat, lng } = req.body;

    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404,
      });
    }

    if (!group) {
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
    const member = await Membership.findOne({
      where: {
        memberId: req.user.id,
        // groupId: req.params.groupId
      },
      //user in the member matches the req user id from the groupId input in the url, want to see if user
      // is associated with groupId input
    });

    if (
      // member.dataValues.status === "Co-host" ||
      req.user.id === group.dataValues.organizerId
    ) {
      const newVenue = await Venue.create({
        groupId: req.params.groupId,
        address,
        city,
        state,
        lat,
        lng,
      });
      const returnObj = {
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng,
      };

      res.json(returnObj);
    } else {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }
);

//Add an Image to a Group based on the Group's id
router.post("/:groupId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  if (req.user.id === group.organizerId) {
    const newImage = await GroupImage.create({
      groupId: req.params.groupId,
      url,
      preview,
    });
    const returnObj = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    };
    res.json(returnObj);
  } else {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//Edit a Group

router.put("/:groupId", requireAuth, validateInfo, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  const { name, about, type, private, city, state } = req.body;
  if (!group) {
    res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }

  if (!group) {
    res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: [
        "Name must be 60 characters or less",
        "About must be 50 characters or more",
        "Type must be 'Online' or 'In person'",
        "Private must be a boolean",
        "City is required",
        "State is required",
      ],
    });
  }
  if (req.user.id === group.organizerId) {
    group.set({ name, about, type, private, city, state });
    await group.save();

    return res.json(group);
  } else {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//Change the status of a membership for a group specified by id
router.put("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);

  const member = await Membership.findOne({
    where: {
      memberId: req.body.memberId,
      groupId: req.params.groupId,
    },
  });
  // member.forEach((mem) => console.log(mem));
  const { userId, status } = req.body;
  // console.log(group, "!!!!!!!");
  // console.log(req.params.groupId);
  console.log(req.body);
  // console.log(member.dataValues, "!!!!!");

  // console.log(member.userId);
  console.log(req.user.id);
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  // for await (let member of group.dataValues.Memberships) {
  if (!member) {
    return res.status(404).json({
      message: "Membership between the user and the group does not exist",
      statusCode: 404,
    });
    // }
  }

  // if (!member.userId) {
  //   return res.status(400).json({
  //     message: "Validation Error",
  //     statusCode: 400,
  //     errors: {
  //       userId: "User couldn't be found",
  //     },
  //   });
  // }

  if (status === "Member") {
    if (
      req.user.id === group.dataValues.organizerId ||
      member.status === "Co-host"
    ) {
      member.set({
        // userId,
        status,
      });
      await member.save();
    } else {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }
  if (status === "Co-host") {
    if (req.user.id === group.dataValues.organizerId) {
      member.set({
        // userId,
        status,
      });
      await member.save();
    } else {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }

  const returnObj = {
    id: member.id,
    memberId: member.memberId,
    groupId: member.groupId,
    status: member.status,
  };

  res.json(returnObj);
});

//Delete a Group
router.delete("/:groupId", requireAuth, async (req, res) => {
  const deleteGroup = await Group.findByPk(req.params.groupId);

  if (!deleteGroup) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  if (req.user.id === deleteGroup.organizerId) {
    await deleteGroup.destroy();
    return res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  } else {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});

//Delete membership to a group specified by id

router.delete("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  const member = await Membership.findOne({
    where: { memberId: req.body.memberId, groupId: req.params.groupId },
  });

  if (!member) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        userId: "User couldn't be found",
      },
    });
  }
  if (!member.status) {
    return res.status(404).json({
      message: "Membership does not exist for this User",
      statusCode: 404,
    });
  } else {
    await member.destroy();

    return res.json({
      message: "Successfully deleted membership from group",
    });
  }
});

module.exports = router;
