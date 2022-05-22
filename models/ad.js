'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Ad.init({
    userId: DataTypes.BIGINT,
    adLink: DataTypes.TEXT,
    title: DataTypes.TEXT,
    address: DataTypes.TEXT,
    name: DataTypes.TEXT,
    photo: DataTypes.TEXT,
    price: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    serviceCode: DataTypes.STRING,
    version: DataTypes.TINYINT,
    balanceChecker: DataTypes.BOOLEAN,
    zaezd: DataTypes.TEXT,
    viezd: DataTypes.TEXT
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    sequelize,
    modelName: 'Ad',
  });
  return Ad;
};