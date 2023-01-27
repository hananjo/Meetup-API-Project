"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Memberships";
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
        memberId: 4,
        groupId: 4,
        status: "Member",
      },
      {
        memberId: 2,
        groupId: 1,
        status: "Pending",
      },
      {
        memberId: 3,
        groupId: 3,
        status: "Co-host",
      },
      {
        memberId: 1,
        groupId: 2,
        status: "Rejected",
      },
      // {
      //   userId: 5,
      //   groupId: 5,
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
    await queryInterface.bulkDelete(options, null, {});
  },
};
