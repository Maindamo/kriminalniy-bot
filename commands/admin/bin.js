const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Bin } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id) => {
  try {
    const bin = await Bin.findByPk(id);
    if (!bin)
      return ctx
        .replyOrEdit("❌ БИН не найден", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("◀️ Назад", `admin_bins_1`)],
          ]),
        })
        .catch((err) => err);

    return ctx
      .replyOrEdit(
        `<b>💳 БИН "${bin.bin}"</b>

💳 П/С: <b>${bin.scheme}</b>
💼 Бренд: <b>${bin.brand}</b>
🌍 Страна: <b>${bin.country}</b>
💳 Тип: <b>${bin.type}</b>
🏦 Банк: <b>${bin.bank}</b>
💸 Валюта: <b>${bin.currency}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                `❌ Удалить БИН`,
                `admin_bin_${bin.id}_delete`
              ),
            ],
            [Markup.callbackButton("◀️ Назад", `admin_bins_1`)],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
