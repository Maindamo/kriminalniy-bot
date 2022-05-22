'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Support extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Support.init({
    adId: DataTypes.BIGINT,
    token: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    sequelize,
    modelName: 'Support',
  });
  return Support;
};