"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Venues";
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
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "123 Eden Ave",
        city: "San Jose",
        state: "CA",
        lat: 37.30519,
        lng: -121.954543,
      },
      {
        groupId: 2,
        address: "3455 Martin Ave",
        city: "Santa Clara",
        state: "CA",
        lat: 37.36946,
        lng: -121.962778,
      },
      {
        groupId: 3,
        address: "125 Mowry Ave",
        city: "Fremont",
        state: "CA",
        lat: 37.5421,
        lng: -121.99358,
      },
      {
        groupId: 4,
        address: "680 Stanford Ave",
        city: "Fremont",
        state: "CA",
        lat: 37.24657,
        lng: -121.98765,
      },
      // {
      //   groupId: 5,
      //   address: "235 Disney Street",
      //   city: "Fremont",
      //   state: "CA",
      //   lat: 37.98378,
      //   lng: -121.98738,
      // },
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
