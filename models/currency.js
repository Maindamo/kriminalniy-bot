"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Currency.init(
    {
      code: DataTypes.STRING,
      eur: DataTypes.DECIMAL(36, 2),
      rub: DataTypes.DECIMAL(36, 2),
      symbol: DataTypes.STRING,
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      sequelize,
      modelName: "Currency",
    }
  );
  return Currency;
};
