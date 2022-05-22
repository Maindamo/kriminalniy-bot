const { Markup } = require("telegraf");
const { Profit } = require("../database");
const paginateButtons = require("../helpers/paginateButtons");
const locale = require("../locale");

module.exports = async (ctx, page = 1) => {
  try {
    const profits = await Profit.paginate({
      pageIndex: parseInt(page),
      pageSize: 10,
      where: {
        userId: ctx.from.id,
      },
    });
    const profits_sum = parseFloat(await Profit.sum("convertedAmount", {
      where: {
        userId: ctx.from.id,
      },
    })).toFixed(2);

    var buttons = profits.data.map((v) => [
      Markup.callbackButton(
        `${v.amount} ${v.currency} | ${v.serviceTitle}`,
        `my_profit_${v.id}`
      ),
    ]);

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`💰 Список ваших профитов (Всего: ${profits.meta.total}, Общая сумма: ${profits_sum} RUB)`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(profits.meta, "my_profits_"),
          [Markup.callbackButton(locale.go_to_menu, "start")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    console.log(err)
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
