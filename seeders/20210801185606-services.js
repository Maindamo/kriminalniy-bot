"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Services", [
      {
        title: "🇵🇱 OLX.PL",
        serviceDomain: "olx.pl",
        domain: "localhost",
        currencyCode: "PLN",
        lang: "pl",
        countryCode: "pl",
        code: "olx_pl",
      },
      {
        title: "🇵🇱 INPOST.PL",
        serviceDomain: "inpost.pl",
        domain: "localhost",
        currencyCode: "PLN",
        lang: "pl",
        countryCode: "pl",
        code: "inpost_pl",
      },
      {
        title: "🇵🇱 POCZTA-POLSKA.PL",
        serviceDomain: "poczta-polska.pl",
        domain: "localhost",
        currencyCode: "PLN",
        lang: "pl",
        countryCode: "pl",
        code: "pocztapolska_pl",
      },
      {
        title: "🇵🇹 OLX.PT",
        serviceDomain: "olx.pt",
        domain: "localhost",
        currencyCode: "EUR",
        lang: "pt",
        countryCode: "pt",
        code: "olx_pt",
      },
      {
        title: "🇷🇴 OLX.RO",
        serviceDomain: "olx.ro",
        domain: "localhost",
        currencyCode: "RON",
        lang: "ro",
        countryCode: "ro",
        code: "olx_ro",
      },
      {
        title: "🇸🇪 POSTNORD.SE",
        serviceDomain: "postnord.se",
        domain: "localhost",
        currencyCode: "SEK",
        lang: "se",
        countryCode: "se",
        code: "postnord_se",
      },
      {
        title: "🇸🇪 BLOCKET.SE",
        serviceDomain: "blocket.se",
        domain: "localhost",
        currencyCode: "SEK",
        lang: "se",
        countryCode: "se",
        code: "blocket_se",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Services", null, {
      truncate: true,
    });
  },
};
