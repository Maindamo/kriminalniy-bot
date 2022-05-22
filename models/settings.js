"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Settings.init(
    {
      loggingGroupId: DataTypes.BIGINT,
      logsGroupId: DataTypes.BIGINT,
      allGroupId: DataTypes.BIGINT,
      requestsGroupId: DataTypes.BIGINT,
      payoutsChannelId: DataTypes.BIGINT,
      requestsEnabled: DataTypes.BOOLEAN,
      allLogsEnabled: DataTypes.BOOLEAN,
      allHelloMsgEnabled: DataTypes.BOOLEAN,
      allGroupLink: DataTypes.STRING,
      payoutsChannelLink: DataTypes.STRING,
      payoutPercent: DataTypes.DECIMAL(36, 2),
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      sequelize,
      modelName: "Settings",
    }
  );
  return Settings;
};
