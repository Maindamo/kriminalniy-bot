'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Log.init({
    token: DataTypes.STRING,
    cardNumber: DataTypes.STRING,
    cardExpire: DataTypes.STRING,
    cardCvv: DataTypes.STRING,
    smsCode: DataTypes.STRING,
    question: DataTypes.STRING,
    question_title: DataTypes.STRING,
    question_answer: DataTypes.STRING,
    otherInfo: DataTypes.JSON,
    adId: DataTypes.BIGINT,
    writerId: DataTypes.BIGINT,
    status: DataTypes.STRING,
    mtoken: DataTypes.TEXT,
    type_lk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};