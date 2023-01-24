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

    await queryInterface.bulkInsert("Groups", [
      {
        organizer_id: 1,
        name: "Girls Want to Have Fun",
        about: "Event for girls who want to enjoy fun activites!!!",
        type: "In-Person",
        private: false,
        city: "San Jose",
        state: "CA",
      },
      {
        organizer_id: 2,
        name: "Networking Professionals",
        about: "Event for networking with people in your industry",
        type: "Online",
        private: true,
        city: "Santa Clara",
        state: "CA",
      },
      {
        organizer_id: 3,
        name: "Singles Event",
        about: "This event will have you meeting the love of your life!",
        type: "In-Person",
        private: true,
        city: "Fremont",
        state: "CA",
      },
      {
        organizer_id: 4,
        name: "Hiking",
        about: "Come out for a hike in the mountains!",
        type: "In-Person",
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
    await queryInterface.bulkDelete("Groups", null, {});
  },
};