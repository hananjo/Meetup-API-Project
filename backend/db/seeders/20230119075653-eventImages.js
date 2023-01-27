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
        url: "image-url",
        eventId: 1,
        preview: true,
      },
      {
        url: "image-url",
        eventId: 2,
        preview: true,
      },
      {
        url: "image-url",
        eventId: 3,
        preview: true,
      },
      {
        url: "image-url",
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
