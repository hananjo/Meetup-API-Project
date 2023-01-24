"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.User, { through: models.Attendee });
      Event.hasMany(models.EventImage, { foreignKey: "event_id" });
      Event.belongsTo(models.Group, { foreignKey: "group_id" });
      Event.belongsTo(models.Venue, { foreignKey: "venue_id" });
    }
  }
  Event.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      venue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            min: 5,
          },
        },
      },
      type: {
        type: DataTypes.ENUM("In-Person", "Online"),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        // validate: {
        //   start(value) {
        //     isAfter(value);
        //   },
        // },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        // validate: {
        //   isAfter: this.startDate,
        // },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(4, 2),
      },
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
      modelName: "Event",
    }
  );
  return Event;
};
