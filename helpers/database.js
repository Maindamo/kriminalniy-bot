require("dotenv").config({
  path: require("path").join(__dirname, "/.env"),
});
const { sequelize, Sequelize } = require("./models");

const withPagination = require("sequelize-pagination");
const options = {
  methodName: "paginate", // the name of the pagination method
  primaryKey: "id", // the primary key field of the model
  oneBaseIndex: true,
};

const userModel = require("./models/user"),
  adModel = require("./models/ad"),
  countryModel = require("./models/country"),
  currencyModel = require("./models/currency"),
  profitModel = require("./models/profit"),
  requestModel = require("./models/request"),
  serviceModel = require("./models/service"),
  settingsModel = require("./models/settings"),
  supportModel = require("./models/support"),
  supportChatModel = require("./models/supportchat"),
  writerModel = require("./models/writer"),
  binModel = require("./models/bin"),
  logModel = require("./models/log");

const params = [sequelize, Sequelize.DataTypes];

const User = userModel(...params),
  Ad = adModel(...params),
  Country = countryModel(...params),
  Currency = currencyModel(...params),
  Profit = profitModel(...params),
  Request = requestModel(...params),
  Service = serviceModel(...params),
  Settings = settingsModel(...params),
  Support = supportModel(...params),
  SupportChat = supportChatModel(...params),
  Writer = writerModel(...params),
  Bin = binModel(...params),
  Log = logModel(...params);

Ad.belongsTo(Service, {
  foreignKey: "serviceCode",
  targetKey: "code",
  as: "service",
});

Ad.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});

Country.hasMany(Service, {
  foreignKey: "countryCode",
  as: "services",
});
Country.hasMany(Writer, {
  foreignKey: "countryCode",
  as: "writers",
});

Service.belongsTo(Country, {
  foreignKey: "countryCode",
  targetKey: "id",
  as: "country",
});

Service.belongsTo(Currency, {
  foreignKey: "currencyCode",
  targetKey: "code",
  as: "currency",
});

User.hasMany(Ad, {
  foreignKey: "userId",
  as: "ads",
});
User.hasMany(Profit, {
  foreignKey: "userId",
  as: "profits",
});

User.hasOne(Request, {
  foreignKey: "userId",
  as: "request",
});

Request.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});

Profit.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});
Profit.belongsTo(User, {
  foreignKey: "writerId",
  targetKey: "id",
  as: "writer",
});

Support.belongsTo(Ad, {
  foreignKey: "adId",
  targetKey: "id",
  as: "ad",
});

Support.hasMany(SupportChat, {
  foreignKey: "supportId",
  as: "messages",
});

SupportChat.belongsTo(Support, {
  foreignKey: "supportId",
  targetKey: "id",
  as: "support",
});

Writer.belongsTo(Country, {
  foreignKey: "countryCode",
  targetKey: "id",
  as: "country",
});

Log.belongsTo(Ad, {
  foreignKey: "adId",
  targetKey: "id",
  as: "ad",
});

Log.belongsTo(User, {
  foreignKey: "writerId",
  targetKey: "id",
  as: "writer",
});

withPagination(options)(User);
withPagination(options)(Ad);
withPagination(options)(Country);
withPagination(options)(Currency);
withPagination(options)(Profit);
withPagination(options)(Request);
withPagination(options)(Service);
withPagination(options)(Support);
withPagination(options)(SupportChat);
withPagination(options)(Writer);
withPagination(options)(Bin);
withPagination(options)(Log);

Profit.sync({
  alter: true
})

module.exports = {
  sequelize,
  Sequelize,
  User,
  Ad,
  Country,
  Currency,
  Profit,
  Request,
  Service,
  Settings,
  Support,
  SupportChat,
  Writer,
  Bin,
  Log,
};
