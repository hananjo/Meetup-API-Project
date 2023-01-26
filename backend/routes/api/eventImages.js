const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { EventImage, Event, Group } = require("../../db/models");
// const { handleValidationErrors } = require("../../utils/validation");
// const { check } = require("express-validator");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const deleteImage = await EventImage.findByPk(req.params.imageId);
  const event = await Event.findByPk(deleteImage.eventId);
  const group = await Group.findByPk(event.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: event.groupId },
  });

  if (!deleteImage) {
    res.status(404).json({
      message: "Event image couldn't be found",
      statusCode: 404,
    });
  }
  if (req.user.id === group.organizerId || member.status === "Co-host") {
    await deleteImage.destroy();
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

module.exports = router;
