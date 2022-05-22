"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mentors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mentors.init(
    {
      id_mentor: DataTypes.INTEGER,
      username_mentor: DataTypes.TEXT,
      description: DataTypes.TEXT,
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      sequelize,
      modelName: "Mentors",
    }
  );
  return Mentors;
};
