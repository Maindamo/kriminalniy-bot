const { Markup } = require("telegraf");
const { Service } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const services = await Service.paginate({
      pageIndex: parseInt(page),
      pageSize: 30,
      orders: [["title", "asc"]],
    });

    var buttons = chunk(
      services.data.map((v) =>
        Markup.callbackButton(`${v.title}`, `admin_service_${v.id}`)
      ),
      2
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`📦 Список сервисов (Всего: ${services.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(services.meta, "admin_services_"),
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
