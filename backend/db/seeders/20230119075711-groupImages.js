"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
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
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1677548113/Project%20Schema/Screen_Shot_2023-02-27_at_5.29.53_PM_upfyt3.png",
        groupId: 1,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678137581/Project%20Schema/Screen_Shot_2023-02-27_at_5.32.09_PM_q9hl1u.png",
        groupId: 2,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1677548110/Project%20Schema/Screen_Shot_2023-02-27_at_5.28.12_PM_gldxe3.png",
        groupId: 3,
        preview: true,
      },
      {
        url: "https://res.cloudinary.com/dwphwqyrn/image/upload/v1678137750/Project%20Schema/Screen_Shot_2023-02-27_at_5.25.40_PM_sbe2df.png",
        groupId: 4,
        preview: true,
      },
      // {
      //   url: "image-url",
      //   groupId: 1,
      //   preview: true,
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
