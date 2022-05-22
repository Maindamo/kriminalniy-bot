"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Country.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      status: DataTypes.TINYINT,
      withLk: DataTypes.BOOLEAN,
      withCustom: DataTypes.BOOLEAN,
      type: DataTypes.TEXT,
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      sequelize,
      modelName: "Country",
    }
  );
  return Country;
};
