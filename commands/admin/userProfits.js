const { Markup } = require("telegraf");
const { Ad, User, Profit } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");

module.exports = async (ctx, userId, page = 1) => {
  try {
    const user = await User.findByPk(userId);
    const profits = await Profit.paginate({
      pageIndex: parseInt(page),
      pageSize: 10,
      where: {
        userId,
      },
    });

    var buttons = profits.data.map((v) => [
      Markup.callbackButton(
        `${v.amount} ${v.currency} | ${v.serviceTitle}`,
        `admin_user_${userId}_profit_${v.id}`
      ),
    ]);

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(
        `💰 Список профитов пользователя <b><a href="tg://user?id=${user.id}">${user.username}</a></b> (Всего: ${profits.meta.total})`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                "💸 Добавить профит",
                `admin_user_${user.id}_add_profit`
              ),
            ],
            ...buttons,
            paginateButtons(profits.meta, `admin_user_${user.id}_profits_`),
            [Markup.callbackButton(locale.go_back, `admin_user_${user.id}`)],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
