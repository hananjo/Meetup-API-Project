"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
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
        groupId: 1,
        venueId: 1,
        name: "Fun in the Sun",
        type: "In person",
        startDate: "2023-1-19 20:00:00",
        endDate: "2023-1-19 22:00:00",
        description: "Enjoy a day in the sun to meet some cool people",
        capacity: 10,
        price: 10.0,
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Technology Seminar",
        type: "Online",
        startDate: "2023-1-20 20:00:00",
        endDate: "2023-1-20 22:00:00",
        description: "Join our Zoom with our top Professionals in the industry",
        capacity: 20,
        price: 50.0,
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Paint Night",
        type: "In person",
        startDate: "2023-1-21 20:00:00",
        endDate: "2023-1-21 22:00:00",
        description:
          "Come bring out your artistic side and join us in our official first painting night. We will have snacks while we mingle, paint, and munch",
        capacity: 50,
        price: 20.0,
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Redwood Peak Hike",
        type: "In person",
        startDate: "2023-1-22 9:00:00",
        endDate: "2023-1-22 15:00:00",
        description:
          "Get your hike in the mountainous redwood trail of Fremont",
        capacity: 30,
        price: 10.0,
      },
      {
        groupId: 1,
        venueId: 1,
        name: "Paint Night",
        type: "In person",
        startDate: "2023-7-20 21:00:00",
        endDate: "2023-7-20 23:00:00",
        description:
          "Paint night is our favorite night to get the girls together and get creative. Let go of the stressful week and let your creative juices flow.",
        capacity: 50,
        price: 20.0,
      },
      {
        groupId: 1,
        venueId: 1,
        name: "Movie Night",
        type: "In person",
        startDate: "2023-12-20 21:00:00",
        endDate: "2023-12-20 23:00:00",
        description:
          "Ready, set, ACTION! Join us at the theater for a romantic comedy. Bring your popcorn and snacks for a girls night, movie night!",
        capacity: 50,
        price: 15.0,
      },
      {
        groupId: 3,
        venueId: 2,
        name: "Beach Bonfire",
        type: "In person",
        startDate: "2023-7-20 21:00:00",
        endDate: "2023-7-20 23:00:00",
        description:
          "Warm nights, soft summer breeze, perfect time for a beach bonfire. Bring your smores to put over a toasty bonfire in Santa Cruz",
        capacity: 100,
        price: 10.0,
      },
      {
        groupId: 3,
        venueId: 2,
        name: "Movie Singles Night",
        type: "In person",
        startDate: "2023-11-20 21:00:00",
        endDate: "2023-11-20 23:00:00",
        description:
          "Its cuffin season! Get your romantic fix both on screen ( and maybe even off screen ;) ).",
        capacity: 100,
        price: 15.0,
      },
      {
        groupId: 2,
        venueId: 3,
        name: "Medical Conference",
        type: "In person",
        startDate: "2023-11-20 9:00:00",
        endDate: "2023-11-20 13:00:00",
        description:
          "Thinking about joining the medical field? Network with some of the best professionals in the industry! Must RSVP to join",
        capacity: 300,
        price: 50.0,
      },
      {
        groupId: 2,
        venueId: 3,
        name: "Internship Seminar",
        type: "Online",
        startDate: "2023-7-20 9:00:00",
        endDate: "2023-7-20 13:00:00",
        description:
          "Fresh out of college and still havent landed a job? Join us on Zoom for an internship opportunity to meet hiring managers at your dream company!",
        capacity: 300,
        price: 50.0,
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Mission Peak Trail",
        type: "In person",
        startDate: "2023-7-20 9:00:00",
        endDate: "2023-7-20 13:00:00",
        description:
          "Fremont's Mission Peak is one of the most rigorous hikes. If you like a challenge, this trail is for you!",
        capacity: 20,
        price: 10.0,
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Castle Rock",
        type: "In person",
        startDate: "2023-4-20 9:00:00",
        endDate: "2023-4-20 13:00:00",
        description:
          "Castle Rock has some great views, lots of shade, and of course, high altitude rocky mountains.",
        capacity: 10,
        price: 10.0,
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
    await queryInterface.bulkDelete(options, null, {});
  },
};
