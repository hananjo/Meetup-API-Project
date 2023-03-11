"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "EventImages";
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
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678237487/Screen_Shot_2023-03-07_at_5.00.00_PM_bzr5eg.png",
        eventId: 1,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678237487/Screen_Shot_2023-03-07_at_5.02.04_PM_l2q53i.png",
        eventId: 2,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678237486/Screen_Shot_2023-03-07_at_5.03.36_PM_w3q1eh.png",
        eventId: 3,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678237619/Screen_Shot_2023-03-07_at_5.04.16_PM_h45mnz.png",
        eventId: 4,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392408/Screen_Shot_2023-03-09_at_12.02.34_PM_l3n9nd.png",
        eventId: 5,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392460/Screen_Shot_2023-03-09_at_12.00.58_PM_q2kn7h.png",
        eventId: 6,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392518/Screen_Shot_2023-03-09_at_11.59.39_AM_fqzj2l.png",
        eventId: 7,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392579/Screen_Shot_2023-03-09_at_12.00.15_PM_yynehs.png",
        eventId: 8,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392636/Screen_Shot_2023-03-09_at_12.04.04_PM_f3mpvi.png",
        eventId: 9,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392667/Screen_Shot_2023-03-09_at_12.04.22_PM_nrguxq.png",
        eventId: 10,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392772/Screen_Shot_2023-03-09_at_11.58.53_AM_uvdevo.png",
        eventId: 11,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678392811/Screen_Shot_2023-03-09_at_12.01.25_PM_v4x9ks.png",
        eventId: 12,
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
    await queryInterface.bulkDelete(options, null, {});
  },
};
