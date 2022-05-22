'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Bin.init({
    bin: DataTypes.BIGINT,
    scheme: DataTypes.STRING,
    type: DataTypes.STRING,
    brand: DataTypes.STRING,
    country: DataTypes.STRING,
    currency: DataTypes.STRING,
    bank: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bin',
  });
  return Bin;
};