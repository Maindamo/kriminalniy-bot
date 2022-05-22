const { Markup } = require("telegraf");
const { User } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const users = await User.paginate({
      pageIndex: parseInt(page),
      pageSize: 30,
      orders: [["createdAt", "desc"]],
    });

    var buttons = chunk(
      users.data.map((v) =>
        Markup.callbackButton(`${v.username}`, `admin_user_${v.id}`)
      )
    , 3);

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`👥 Список пользователей (Всего: ${users.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(users.meta, "admin_users_"),
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
