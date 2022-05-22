const { Markup } = require("telegraf");
const { Profit } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const profits = await Profit.paginate({
      pageIndex: parseInt(page),
      pageSize: 30,
      orders: [["status", "asc"]],
    });

    var buttons = chunk(
      profits.data.map((v) =>
        Markup.callbackButton(
          `${v.status == 0 ? "⏳" : (v.status == 1 ? "✅" : "🌎")} ${v.amount} ${v.currency}`,
          `admin_profit_${v.id}`
        )
      ),
      3
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`💰 Список профитов (Всего: ${profits.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(profits.meta, "admin_profits_"),
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
