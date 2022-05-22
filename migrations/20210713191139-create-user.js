'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      username: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      hideNick: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      percent: {
        type: Sequelize.DECIMAL(36, 2),
        allowNull: true,
      },
      percentType: {
        type: Sequelize.TINYINT,
        allowNull: true
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
    await queryInterface.dropTable('Users');
  }
};