'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Service.init({
    title: DataTypes.STRING,
    serviceDomain: DataTypes.STRING,
    domain: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    currencyCode: DataTypes.STRING,
    lang: DataTypes.STRING,
    translate: DataTypes.JSON,
    countryCode: DataTypes.STRING,
    code: DataTypes.STRING,
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    sequelize,
    modelName: 'Service',
  });
  return Service;
};