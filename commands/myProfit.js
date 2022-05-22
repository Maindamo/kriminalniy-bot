const { Markup } = require("telegraf");
const { Profit } = require("../database");

module.exports = async (ctx, id) => {
  try {
    const profit = await Profit.findOne({
      where: {
        id,
        userId: ctx.from.id,
      },
    });
    if (!profit)
      return ctx
        .replyOrEdit("❌ Профит не найден", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("◀️ Назад", "my_profits_1")],
          ]),
        })
        .catch((err) => err);

    return ctx
      .replyOrEdit(
        `💰 Профит #${profit.id}
    
📦 Сервис: <b>${profit.serviceTitle}</b>
💸 Сумма: <b>${profit.amount} ${profit.currency} / ${
          profit.convertedAmount
        } RUB</b>
🚦 Статус: <b>${profit.status == 0 ? "В ожидании ⏳" : "✅ Выплачено"}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("◀️ Назад", "my_profits_1")],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    console.log(err)
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
