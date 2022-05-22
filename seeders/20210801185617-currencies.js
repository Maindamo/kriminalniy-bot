"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Currencies", [
      {
        code: "PLN",
        eur: 0.22,
        rub: 19.0,
        symbol: "zł",
      },
      {
        code: "GBP",
        eur: 1.17,
        rub: 102.18,
        symbol: "£",
      },
      {
        code: "DKK",
        eur: 0.13,
        rub: 11.7,
        symbol: "kr",
      },
      {
        code: "EUR",
        eur: 1,
        rub: 86.99,
        symbol: "€",
      },
      {
        code: "UAH",
        eur: 0.031,
        rub: 2.72,
        symbol: "₴",
      },
      {
        code: "RUB",
        eur: 0.012,
        rub: 1,
        symbol: "₽",
      },
      {
        code: "SEK",
        eur: 0.098,
        rub: 8.5,
        symbol: "kr",
      },
      {
        code: "RON",
        eur: 0.2,
        rub: 17.65,
        symbol: "lei",
      },
      {
        code: "HRK",
        eur: 0.13,
        rub: 11.52,
        symbol: "Kn",
      },
      {
        code: "BGN",
        eur: 0.51,
        rub: 44.37,
        symbol: "лв",
      },
      {
        code: "RSD",
        eur: 0.008,
        rub: 0.74,
        symbol: "din",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Currencies", null, {
      truncate: true,
    });
  },
};
