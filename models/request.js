'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Request.init({
    userId: DataTypes.BIGINT,
    step1: DataTypes.TEXT,
    step2: DataTypes.TEXT,
    step3: DataTypes.TEXT,
    status: DataTypes.TINYINT
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    sequelize,
    modelName: 'Request',
  });
  return Request;
};