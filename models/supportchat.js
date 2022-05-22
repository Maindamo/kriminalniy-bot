'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SupportChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SupportChat.init({
    supportId: DataTypes.BIGINT,
    messageFrom: DataTypes.TINYINT,
    message: DataTypes.TEXT,
    readed: DataTypes.BOOLEAN,
    messageId: DataTypes.INTEGER
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    sequelize,
    modelName: 'SupportChat',
  });
  return SupportChat;
};