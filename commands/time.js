const { Markup } = require("telegraf");
const moment = require('moment-timezone');

module.exports = async (ctx) => {
  let format = 'HH:mm:ss';
let australia  = moment().tz("Australia/Sydney").format(format)
let port = moment().tz("Europe/Lisbon").format(format)
let poland = moment().tz("Europe/Warsaw").format(format)
let italy = moment().tz("Europe/Rome").format(format)
let horva = moment().tz("Europe/Zagreb").format(format)

  return ctx.reply(`⏰ Время в настоящий момент:\n\n🇦🇺 Австралия: ${australia}\n🇵🇹 Португалия: ${port}\n🇵🇱 Польша: ${poland}\n🇮🇹 Италия: ${italy}\n🇭🇷 Хорватия: ${horva}`)
};