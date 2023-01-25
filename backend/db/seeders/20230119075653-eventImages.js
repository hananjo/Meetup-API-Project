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
    await queryInterface.bulkInsert("EventImages", [
      {
        url: "",
        eventId: 1,
        preview: true,
      },
      {
        url: "",
        eventId: 2,
        preview: true,
      },
      {
        url: "",
        eventId: 3,
        preview: true,
      },
      {
        url: "",
        eventId: 4,
        preview: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    //  * await queryInterface.bulkDelete('People', null, {});
    //  */
    await queryInterface.bulkDelete("EventImages", null, {});
  },
};
