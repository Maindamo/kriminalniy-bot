'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ads', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      adLink: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      title: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      photo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phone: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      serviceCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      version: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 2
      },
      balanceChecker: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
      }
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ads');
  }
};