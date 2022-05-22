const moment = require("moment-timezone");
moment.tz.setDefault("Europe/Moscow");
moment.locale("ru");

module.exports = moment;
