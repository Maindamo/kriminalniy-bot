"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Settings",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        loggingGroupId: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        logsGroupId: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        allGroupId: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        requestsGroupId: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        payoutsChannelId: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        requestsEnabled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        allLogsEnabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        allHelloMsgEnabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        allGroupLink: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        payoutsChannelLink: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        payoutPercent: {
          type: Sequelize.DECIMAL(36, 2),
          allowNull: false,
          defaultValue: 70,
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
    await queryInterface.dropTable("Settings");
  },
};
