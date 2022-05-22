const { Markup } = require("telegraf");
const { Country } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const countries = await Country.paginate({
      pageIndex: parseInt(page),
      pageSize: 30,
      orders: [["title", "asc"]],
    });

    var buttons = chunk(
      countries.data.map((v) =>
        Markup.callbackButton(`${v.title}`, `admin_country_${v.id}`)
      ),
      3
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`🌎 Список стран (Всего: ${countries.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(countries.meta, "admin_countries_"),
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
