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
    await queryInterface.bulkInsert("GroupImages", [
      {
        url: "",
        groupId: 1,
        preview: true,
      },
      {
        url: "",
        groupId: 2,
        preview: true,
      },
      {
        url: "",
        groupId: 3,
        preview: true,
      },
      {
        url: "",
        groupId: 4,
        preview: true,
      },
      {
        url: "",
        groupId: 1,
        preview: true,
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
    await queryInterface.bulkDelete("GroupImages", null, {});
  },
};
