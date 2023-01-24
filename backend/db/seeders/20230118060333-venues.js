"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    //  options = {}
    await queryInterface.bulkInsert("Venues", [
      {
        group_id: 1,
        address: "123 Eden Ave",
        city: "San Jose",
        state: "CA",
        lat: 37.30519,
        lng: -121.954543,
      },
      {
        group_id: 2,
        address: "3455 Martin Ave",
        city: "Santa Clara",
        state: "CA",
        lat: 37.36946,
        lng: -121.962778,
      },
      {
        group_id: 3,
        address: "125 Mowry Ave",
        city: "Fremont",
        state: "CA",
        lat: 37.5421,
        lng: -121.99358,
      },
      {
        group_id: 4,
        address: "680 Stanford Ave",
        city: "Fremont",
        state: "CA",
        lat: 37.24657,
        lng: -121.98765,
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
    await queryInterface.bulkDelete("Venues", null, {});
  },
};
