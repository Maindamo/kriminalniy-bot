"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Countries", [
      {
        id: "dk",
        title: "🇩🇰 Дания",
        withLk: false,
      },
      {
        id: "en",
        title: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Англия",
        withLk: false,
      },
      {
        id: "es",
        title: "🇪🇸 Испания",
        withLk: false,
      },
      {
        id: "pl",
        title: "🇵🇱 Польша",
        withLk: true,
      },
      {
        id: "pt",
        title: "🇵🇹 Португалия",
        withLk: false,
      },
      {
        id: "fr",
        title: "🇫🇷 Франция",
        withLk: false,
      },
      {
        id: "bg",
        title: "🇧🇬 Болгария",
        withLk: false,
      },
      {
        id: "ro",
        title: "🇷🇴 Румыния",
        withLk: false,
      },
      {
        id: "hr",
        title: "🇭🇷 Хорватия",
        withLk: false,
      },
      {
        id: "se",
        title: "🇸🇪 Швеция",
        withLk: false,
      },
      {
        id: "ua",
        title: "🇺🇦 Украина",
        withLk: false,
      },
      {
        id: "rs",
        title: "🇷🇸 Сербия",
        withLk: false,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Countries", null, {
      truncate: true,
    });
  },
};
