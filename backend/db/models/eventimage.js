"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, { foreignKey: "event_id" });
    }
  }
  EventImage.init(
    {
      url: DataTypes.STRING,
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      previewImage: DataTypes.BOOLEAN,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EventImage",
    }
  );
  return EventImage;
};
