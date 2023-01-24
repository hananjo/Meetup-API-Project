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
    await queryInterface.bulkInsert("Attendees", [
      {
        user_id: 1,
        status: "Member",
        event_id: 3,
      },
      {
        user_id: 2,
        status: "Pending",
        event_id: 1,
      },
      {
        user_id: 3,
        status: "Waitlist",
        event_id: 2,
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
    await queryInterface.bulkDelete("Attendees", null, {});
  },
};
