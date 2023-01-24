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
    await queryInterface.bulkInsert("Memberships", [
      {
        user_id: 4,
        group_id: 4,
        status: "Member",
      },
      {
        user_id: 2,
        group_id: 1,
        status: "Pending",
      },
      {
        user_id: 3,
        group_id: 3,
        status: "Co-host",
      },
      {
        user_id: 1,
        group_id: 2,
        status: "Rejected",
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
    await queryInterface.bulkDelete("Memberships", null, {});
  },
};
