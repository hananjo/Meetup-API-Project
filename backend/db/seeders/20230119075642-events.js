"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Fun in the Sun",
        type: "In person",
        startDate: "2023-1-19 20:00:00",
        endDate: "2023-1-19 22:00:00",
        description: "Enjoy a day in the sun to meet some cool people",
        capacity: 10,
        price: 10.0,
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Technology Seminar",
        type: "Online",
        startDate: "2023-1-20 20:00:00",
        endDate: "2023-1-20 22:00:00",
        description: "Join our Zoom with our top Professionals in the industry",
        capacity: 20,
        price: 50.0,
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Paint Night",
        type: "In person",
        startDate: "2023-1-21 20:00:00",
        endDate: "2023-1-21 22:00:00",
        description:
          "Enjoy a day in the sun to meet some cool people to mingle with",
        capacity: 50,
        price: 20.0,
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Mission Peak Hike",
        type: "In person",
        startDate: "2023-1-22 9:00:00",
        endDate: "2023-1-22 9:00:00",
        description: "Get your hike in the mountainous trail of Fremont",
        capacity: 30,
        price: 10.0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, null, {});
  },
};
