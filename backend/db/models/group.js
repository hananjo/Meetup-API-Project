"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Group.belongsToMany(models.User, { through: models.Member });
      Group.hasMany(models.Membership, { foreignKey: "groupId", onDelete: 'CASCADE' });
      Group.hasMany(models.Event, {
        // as: "capacity",
        foreignKey: "groupId",
        onDelete: 'CASCADE'
      });
      Group.hasMany(models.GroupImage, {
        // as: "previewImage",
        foreignKey: "groupId",
        onDelete: 'CASCADE'
      });
      Group.hasMany(models.Venue, { foreignKey: "groupId", onDelete: 'CASCADE' });
      Group.belongsTo(models.User, {
        as: "Organizer",
        foreignKey: "organizerId",
        onDelete: 'CASCADE'
      });
    }
  }
  Group.init(
    {
      organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            min: 50,
          },
        },
      },
      type: {
        type: DataTypes.ENUM("In person", "Online"),
        allowNull: false,
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "Group",
    }
  );
  return Group;
};
