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
        userId: 4,
        group_id: 4,
        status: "Member",
      },
      {
        userId: 2,
        group_id: 1,
        status: "Pending",
      },
      {
        userId: 3,
        group_id: 3,
        status: "Co-host",
      },
      {
        userId: 1,
        group_id: 2,
        status: "Rejected",
      },
      // {
      //   userId: 5,
      //   group_id: 5,
      //   status: "Co-host",
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
    await queryInterface.bulkDelete("Memberships", null, {});
  },
};
