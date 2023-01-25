const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { GroupImage } = require("../../db/models");
// const { handleValidationErrors } = require("../../utils/validation");
// const { check } = require("express-validator");

const router = express.Router();

//Delete an Image for a Group

router.delete("/:imageId", requireAuth, async (req, res) => {
  const deleteImage = await GroupImage.findByPk(req.params.imageId);

  if (!deleteImage) {
    res.status(404).json({
      message: "Group image couldn't be found",
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
