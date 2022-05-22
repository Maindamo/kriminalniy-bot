const { Markup } = require("telegraf");
const { Request } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");
const getRequestStatus = require("../../helpers/getRequestStatus");

module.exports = async (ctx, page = 1) => {
  try {
    const requests = await Request.paginate({
      pageIndex: parseInt(page),
      pageSize: 30,
      orders: [["status", "asc"]],
    });

    var buttons = chunk(
      requests.data.map((v) =>
        Markup.callbackButton(
          `${getRequestStatus(v.status)} #${v.id}`,
          `admin_request_${v.id}`
        )
      ),
      3
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`📰 Список заявок (Всего: ${requests.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(requests.meta, "admin_requests_"),
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
