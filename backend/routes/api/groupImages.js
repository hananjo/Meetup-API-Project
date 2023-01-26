const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { GroupImage, Group, Event } = require("../../db/models");
// const { handleValidationErrors } = require("../../utils/validation");
// const { check } = require("express-validator");

const router = express.Router();

//Delete an Image for a Group

router.delete("/:imageId", requireAuth, async (req, res) => {
  const deleteImage = await GroupImage.findByPk(req.params.imageId);
  const group = await Group.findByPk(deleteImage.groupId);
  const member = await Membership.findOne({
    where: { userId: req.user.id, groupId: deleteImage.groupId },
  });
  if (!deleteImage) {
    res.status(404).json({
      message: "Group image couldn't be found",
      statusCode: 404,
    });
  }
  if (req.user.id === group.organizerid || member.status === "Co-host") {
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
