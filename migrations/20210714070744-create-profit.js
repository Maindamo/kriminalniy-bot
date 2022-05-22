"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Profits",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT,
        },
        userId: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        amount: {
          type: Sequelize.DECIMAL(36, 2),
          allowNull: false,
        },
        convertedAmount: {
          type: Sequelize.DECIMAL(36, 2),
          allowNull: false,
        },
        serviceTitle: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        currency: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.TINYINT,
          allowNull: false,
          defaultValue: 0,
        },
        writerId: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        channelMessageId: {
          type: Sequelize.BIGINT,
          allowNull: true,
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
    await queryInterface.dropTable("Profits");
  },
};
