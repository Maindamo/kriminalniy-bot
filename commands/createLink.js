const { Markup } = require("telegraf");
const { Country } = require("../database");
const chunk = require("chunk");
const locale = require("../locale");

module.exports = async (ctx) => {
  try {
    const countries = await Country.findAll({
      order: [["id", "asc"]],
      where: {
        status: 1,
      },
    });

    return ctx
      .replyOrEdit(locale.choose_country, {
        reply_markup: Markup.inlineKeyboard([
          ...chunk(
            countries.map((v) =>
              Markup.callbackButton(v.title, `create_link_${v.id}`)
            )
          ),
          [Markup.callbackButton(locale.go_to_menu, "start")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
