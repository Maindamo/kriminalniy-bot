const { Markup } = require("telegraf");
const locale = require("../locale");

module.exports = async (ctx) => {
  return ctx
    .replyOrEdit(locale.requests.need_send_request, {
      parse_mode: "HTML",
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.callbackButton(
            locale.requests.ready_send_button,
            "send_request"
          ),
        ],
      ]),
    })
    .catch((err) => err);
};
