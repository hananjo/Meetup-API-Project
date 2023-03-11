"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Girls Want to Have Fun",
        about: "Group for girls who want to enjoy fun activites!!!",
        type: "In person",
        private: false,
        city: "San Jose",
        state: "CA",
      },
      {
        organizerId: 2,
        name: "Networking Professionals",
        about:
          "Groups looking to network with people in their desired industry",
        type: "Online",
        private: true,
        city: "Santa Clara",
        state: "CA",
      },
      {
        organizerId: 3,
        name: "Single & Ready to Mingle",
        about: "This group will have you meeting the love of your life!",
        type: "In person",
        private: true,
        city: "Fremont",
        state: "CA",
      },
      {
        organizerId: 4,
        name: "Hiking",
        about: "Come out for a hike in the mountains!",
        type: "In person",
        private: false,
        city: "Fremont",
        state: "CA",
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
