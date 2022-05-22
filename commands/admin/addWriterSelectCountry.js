const { Markup } = require("telegraf");
const { Country } = require("../../database");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx) => {
  try {
    const countries = await Country.findAll({
      order: [["id", "asc"]],
    });
    await ctx
      .replyOrEdit("🌎 Выберите страну", {
        reply_markup: Markup.inlineKeyboard([
          ...(countries.length >= 1
            ? chunk(
                countries.map((v) =>
                  Markup.callbackButton(v.title, `admin_add_writer_${v.id}`)
                )
              )
            : [[Markup.callbackButton("Страница пуста", "none")]]),
          [Markup.callbackButton(locale.go_back, "admin_writers_1")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
