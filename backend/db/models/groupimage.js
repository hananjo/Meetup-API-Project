"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupImage.belongsTo(models.Group, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
    }
  }
  GroupImage.init(
    {
      url: DataTypes.STRING,
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      preview: DataTypes.BOOLEAN,
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
      modelName: "GroupImage",
    }
  );
  return GroupImage;
};
