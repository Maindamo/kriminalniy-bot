const { Markup } = require("telegraf");
const { Bin } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const bins = await Bin.paginate({
      pageIndex: parseInt(page),
      pageSize: 15,
      orders: [["createdAt", "desc"]],
    });

    var buttons = chunk(
      bins.data.map((v) => Markup.callbackButton(`${v.bin} | ${v.bank}`, `admin_bin_${v.id}`)),
      2
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`💳 Список кастомных БИНов (Всего: ${bins.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(bins.meta, "admin_bins_"),
          [Markup.callbackButton("💳 Добавить БИН", "admin_add_bin")],
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
