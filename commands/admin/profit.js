const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Ad, Profit } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id, userId = null) => {
  try {
    const profit = await Profit.findByPk(id, {
      include: [
        {
          association: "writer",
          required: true,
        },
        {
          association: "user",
          required: true,
        },
      ],
    });
    if (!profit)
      return ctx
        .replyOrEdit("❌ Профит не найден", {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                "◀️ Назад",
                userId ? `admin_user_${userId}_profits_1` : `admin_profits_1`
              ),
            ],
          ]),
        })
        .catch((err) => err);

    var workerAmount = (
        (parseFloat(profit.amount) / 100) *
        parseFloat(ctx.state.bot.payoutPercent)
      ).toFixed(2),
      workerConvertedAmount = (
        (parseFloat(profit.amount) / 100) *
        parseFloat(ctx.state.bot.payoutPercent)
      ).toFixed(2);

    var text = `<b>💎 НОВЫЙ ПРОФИТ ${profit.serviceTitle}</b>
🤑 Оплачено: <b>${profit.amount} ${profit.currency} / ${profit.convertedAmount} RUB</b>
💰 Доля: <b>${workerAmount} ${profit.currency} / ${workerConvertedAmount} RUB</b>
👨‍💻 <u>Воркер</u>: <b><a href="tg://user?id=${profit.user.id}">${profit.user.username}</a></b>
🦊 <u>Вбивер</u>: <b><a href="tg://user?id=${profit.writer.id}">${profit.writer.username}</a></b>
`;

    return ctx
      .replyOrEdit(text, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton(
              "👤 Перейти к пользователю",
              `admin_user_${profit.userId}`
            ),
          ],
          [
            Markup.callbackButton(
              "✍️ Перейти к вбиверу",
              `admin_user_${profit.writerId}`
            ),
          ],
          [
            Markup.callbackButton(
              locale.newProfit.wait,
              `admin_${userId ? `user_${userId}_` : ""}profit_${
                profit.id
              }_set_status_wait`
            ),
            Markup.callbackButton(
              locale.newProfit.payed,
              `admin_${userId ? `user_${userId}_` : ""}profit_${
                profit.id
              }_set_status_payed`
            ),
            Markup.callbackButton(
              locale.newProfit.razvitie,
              `admin_${userId ? `user_${userId}_` : ""}profit_${
                profit.id
              }_set_status_razvitie`
            ),
          ],
          [
            Markup.callbackButton(
              `❌ Удалить профит`,
              `admin_${userId ? `user_${userId}_` : ""}profit_${
                profit.id
              }_delete`
            ),
          ],
          [
            Markup.callbackButton(
              "◀️ Назад",
              userId
                ? `admin_user_${profit.userId}_profits_1`
                : `admin_profits_1`
            ),
          ],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    console.log(err)
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
