const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Country, Service } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id) => {
  try {
    const country = await Country.findByPk(id);
    if (!country)
      return ctx
        .replyOrEdit("❌ Страна не найдена", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("◀️ Назад", `admin_countries_1`)],
          ]),
        })
        .catch((err) => err);

    const countryServicesCount = await Service.count({
      where: {
        countryCode: country.id,
      },
    });
    return ctx
      .replyOrEdit(
        `<b>🌍 Страна "${country.title}"</b>

📦 Сервисов: <b>${countryServicesCount}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                country.status == 1 ? `👁 Скрыть страну` : `👁 Отображать страну`,
                `admin_country_${country.id}_${
                  country.status == 1 ? "hide" : "show"
                }`
              ),
            ],
            [Markup.callbackButton("◀️ Назад", `admin_countries_1`)],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
