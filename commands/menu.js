const { Markup } = require("telegraf");
const { Profit, Ad } = require("../database");
const declOfNum = require("../helpers/declOfNum");
const moment = require("../helpers/moment");
const locale = require("../locale");

module.exports = async (ctx) => {
  try {
      // ctx.telegram.sendVideo(ctx.from.id, 'BAACAgIAAxkBAAEBDGBhjYYaROiuUugUpHnQa-dJRe6ZvwACPxUAAu8qaUjFMJrIuQMcuiIE')
    var text = locale.mainMenu.text;
    var profitsCount = await Profit.count({
        where: {
          userId: ctx.from.id,
        },
      }),
      profitsSum = parseInt(
        await Profit.sum("convertedAmount", {
          where: { userId: ctx.from.id },
        })
      ),
      adsCount = await Ad.count({
        where: {
          userId: ctx.from.id,
        },
      }),
      daysWithUs = moment().diff(moment(ctx.state.user.createdAt), "days"),
      hoursWithUs = moment().diff(moment(ctx.state.user.createdAt), "hours"),
      minutesWithUs = moment().diff(
        moment(ctx.state.user.createdAt),
        "minutes"
      ),
      secondsWithUs = moment().diff(
        moment(ctx.state.user.createdAt),
        "seconds"
      );

    withUsText = `${daysWithUs} ${declOfNum(daysWithUs, [
      "день",
      "дня",
      "дней",
    ])}`;
    if (daysWithUs < 1)
      withUsText = `${hoursWithUs} ${declOfNum(hoursWithUs, [
        "час",
        "часа",
        "часов",
      ])}`;
    if (hoursWithUs < 1)
      withUsText = `${minutesWithUs} ${declOfNum(minutesWithUs, [
        "минуту",
        "минуты",
        "минут",
      ])}`;
    if (minutesWithUs < 1)
      withUsText = `${secondsWithUs} ${declOfNum(secondsWithUs, [
        "секунду",
        "секунды",
        "секунд",
      ])}`;

    var { status } = ctx.state.user;
    text = text
      .replace("{id}", ctx.from.id)
      .replace(
        "{status}",
        status == 1
          ? locale.roles.admin
          : status == 2
          ? locale.roles.writer
          : status == 3
          ? locale.roles.pro
          : locale.roles.worker
      )
      .replace("{profits_count}", profitsCount)
      .replace("{profits_sum}", `${profitsSum} RUB`)
      .replace("{ads_count}", adsCount)
      .replace("{with_us}", withUsText)
      .replace(
        "{hide_nick}",
        ctx.state.user.hideNick ? "Скрыт 🔴" : "Виден 🟢"
      );

    return ctx
      .replyOrEdit(text, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton(
              locale.mainMenu.buttons.create_link,
              "create_link"
            ),
          ],
          [Markup.callbackButton(locale.mainMenu.buttons.my_ads, "my_ads_1")],
          [
            Markup.callbackButton(
              locale.mainMenu.buttons.my_profits,
              "my_profits_1"
            ),
          ],
          ...(ctx.state.user.status !== 0 && process.env.SMS_TOKEN
            ? [
                [
                  Markup.callbackButton(
                    locale.mainMenu.buttons.send_sms,
                    "send_sms"
                  ),
                ],
              ]
            : []),
          [
            Markup.callbackButton(locale.mainMenu.buttons.writer, "writers"),
            Markup.callbackButton(
              locale.mainMenu.buttons.workers_top,
              "workers_top"
            ),
            // Markup.callbackButton(locale.mainMenu.buttons.chats, "chats"),
          ],
          [Markup.callbackButton(locale.mainMenu.buttons.settings, "settings")],
          [Markup.callbackButton(`🍷 Наставники`, "mentors")],
          [Markup.callbackButton(`📧 Отправка смс`, "sendSms")],
          [
            Markup.urlButton(`🧙‍♀️ Чат воркеров`, ctx.state.bot.allGroupLink),
            Markup.urlButton(`💸 Выплаты`, ctx.state.bot.payoutsChannelLink)
          ]
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
