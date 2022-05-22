require("dotenv").config();
const fs = require("fs");

const connection = {
  username: "gen_user",
  password: "oth0paedr7",
  database: "default_db",
  host: "92.53.107.243",
  port: 3306,
  dialect: "mysql",
  timezone: "+03:00",
  dialectOptions: {
    charset: "utf8mb4",
  },
  logging: false,
};

module.exports = {
  development: connection,
  test: connection,
  production: connection,
};
