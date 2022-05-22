"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profit.init(
    {
      userId: DataTypes.BIGINT,
      amount: DataTypes.DECIMAL(36, 2),
      convertedAmount: DataTypes.DECIMAL(36, 2),
      serviceTitle: DataTypes.STRING,
      currency: DataTypes.STRING,
      status: DataTypes.TINYINT,
      writerId: DataTypes.BIGINT,
      channelMessageId: DataTypes.BIGINT,
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      sequelize,
      modelName: "Profit",
    }
  );
  return Profit;
};
