const { Markup } = require("telegraf");
const { Country, Service } = require("../database");
const chunk = require("chunk");
const locale = require("../locale");

module.exports = async (ctx, countryCode) => {
  try {
    const services = await Service.findAll({
      where: {
        countryCode,
        status: 1,
      },
      order: [["title", "asc"]],
    });

    var buttons = chunk(
      services.map((v) =>
        Markup.callbackButton(v.title, `create_link_service_${v.code}`)
      )
    );
    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];
    return ctx
      .replyOrEdit(locale.choose_service, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          [Markup.callbackButton(locale.go_back, "create_link")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
