const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { EventImage, Event, Group } = require("../../db/models");
// const { handleValidationErrors } = require("../../utils/validation");
// const { check } = require("express-validator");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const deleteImage = await EventImage.findByPk(req.params.imageId);
  const event = await Event.findByPk(deleteImage.eventId);
  const group = await G;

  if (!deleteImage) {
    res.status(404).json({
      message: "Event image couldn't be found",
      statusCode: 404,
    });
  }

  await deleteImage.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
