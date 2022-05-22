const { Markup } = require("telegraf");
const { Ad, User } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");

module.exports = async (ctx, userId, page = 1) => {
  try {
    const user = await User.findByPk(userId);
    const ads = await Ad.paginate({
      pageIndex: parseInt(page),
      pageSize: 10,
      where: {
        userId,
      },
      include: [
        {
          association: "service",
          required: true,
          include: [
            {
              association: "country",
              required: true,
            },
          ],
        },
      ],
    });

    var buttons = ads.data.map((v) => [
      Markup.callbackButton(
        `${v.service.title} ${v.version}.0 | ${v.title}`,
        `admin_user_${user.id}_ad_${v.id}`
      ),
    ]);

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`📦 Список объявлений пользователя <b><a href="tg://user?id=${user.id}">${user.username}</a></b> (Всего: ${ads.meta.total})`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(ads.meta, `admin_user_${user.id}_ads_`),
          [Markup.callbackButton(locale.go_back, `admin_user_${user.id}`)],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
