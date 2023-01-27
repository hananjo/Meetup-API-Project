"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Attendees",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
          },
          onDelete: "cascade",
        },
        status: {
          type: Sequelize.ENUM("Member", "Pending", "Waitlist"),
          allowNull: false,
        },
        eventId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Events",
          },
          onDelete: "cascade",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Attendees", options);
  },
};
