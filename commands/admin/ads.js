const { Markup } = require("telegraf");
const { Ad } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const ads = await Ad.paginate({
      pageIndex: parseInt(page),
      pageSize: 10,
      orders: [["createdAt", "desc"]],
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

    var buttons = ads.data.map((v) =>
      [Markup.callbackButton(
        `${v.service.title} ${v.version}.0 | ${v.title}`,
        `admin_ad_${v.id}`
      )]
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`🗃 Список объявлений (Всего: ${ads.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(ads.meta, "admin_ads_"),
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
