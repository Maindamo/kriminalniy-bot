"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Settings", [{}]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Settings", null, {
      truncate: true,
    });
  },
};
