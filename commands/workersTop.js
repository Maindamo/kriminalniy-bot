const { Markup } = require("telegraf");
const { User } = require("../database");
const { Sequelize } = require("../models");

module.exports = async (ctx) => {
  try {
    const users = await User.findAll({
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn("SUM", Sequelize.col("profits.convertedAmount")),
            "totalProfits",
          ],
        ],
      },
      include: [
        {
          association: "profits",
          attributes: [],
          required: true,
        },
      ],
      group: ["User.id"],
      order: [[Sequelize.literal("totalProfits"), "desc"]],
      limit: 10,
    });
    var text = users
      .map(
        (v) =>
          `<b>${
            v.hideNick
              ? "Скрыт"
              : `<a href="tg://user?id=${v.id}">${v.username}</a>`
          } — 💰 ${parseFloat(v.getDataValue("totalProfits")).toFixed(
            2
          )} RUB</b>`
      )
      .join("\n");
    if (users.length < 1) text = "🔍 В топе ещё никого нету";
    return ctx
      .replyOrEdit(
        `<b>🏆 Топ воркеров</b>
     
${text}`,
        {
          parse_mode: "HTML",
          disable_notification: true,
          disable_web_page_preview: true,
          reply_markup: ctx.updateType == "callback_query" ? Markup.inlineKeyboard([
            [Markup.callbackButton("◀️ В меню", "start")],
          ]) : {},
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
