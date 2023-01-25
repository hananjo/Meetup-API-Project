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
        event_id: 1,
        preview: true,
      },
      {
        url: "",
        event_id: 2,
        preview: true,
      },
      {
        url: "",
        event_id: 3,
        preview: true,
      },
      {
        url: "",
        event_id: 4,
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
