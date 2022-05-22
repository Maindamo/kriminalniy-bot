const { Markup } = require("telegraf");
const locale = require("../locale");

module.exports = async (ctx) => {
  return ctx
    .replyOrEdit(`⚙️ Настройки`, {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.callbackButton(
            ctx.state.user.hideNick
              ? "🟢 Показывать никнейм"
              : "🔴 Скрыть никнейм",
            `settings_nickname_${ctx.state.user.hideNick ? "show" : "hide"}`
          ),
        ],
        [Markup.callbackButton(locale.go_to_menu, "start")],
      ]),
    })
    .catch((err) => err);
};
