const { Markup } = require("telegraf");
const locale = require("../../locale");

module.exports = async (ctx) => {
  try {
    const settings = ctx.state.bot;

    return ctx
      .replyOrEdit(
        `⚙️ Настройки бота
    
📰 ID группы для логирования действий: <code>${
          settings.loggingGroupId || "не задано"
        }</code>
💳 ID группы для логов: <code>${settings.logsGroupId || "не задано"}</code>
👥 ID общей группы: <code>${settings.allGroupId || "не задано"}</code>
🧾 ID группы для заявок: <code>${settings.requestsGroupId || "не задано"}</code>
💰 ID канала для выплат: <code>${
          settings.payoutsChannelId || "не задано"
        }</code>
📩 Заявки: <b>${settings.requestsEnabled ? "включены" : "выключены"}</b>
💭 Логи в общий чат: <b>${
          settings.allLogsEnabled ? "включены" : "выключены"
        }</b>
👋 Приветственное сообщение при вступлении в общий чат: <b>${
          settings.allHelloMsgEnabled ? "включено" : "выключено"
        }</b>
💬 Ссылка на общий чат: <b>${settings.allGroupLink || "не задано"}</b>
💸 Ссылка на канал выплат: <b>${settings.payoutsChannelLink || "не задано"}</b>
💴 Процент воркера за залёт: <b>${settings.payoutPercent}%</b>
`,
        {
          disable_web_page_preview: true,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                settings.requestsEnabled
                  ? "❌ Выключить заявки"
                  : "✅ Включить заявки",
                `admin_turn_${settings.requestsEnabled ? "off" : "on"}_requestsEnabled`
              ),
            ],
            [
              Markup.callbackButton(
                settings.allLogsEnabled
                  ? "❌ Выключить логи в общий чат"
                  : "✅ Включить логи в общий чат",
                `admin_turn_${settings.allLogsEnabled ? "off" : "on"}_allLogsEnabled`
              ),
            ],
            [
              Markup.callbackButton(
                settings.allHelloMsgEnabled
                  ? "❌ Выключить приветственное сообщение"
                  : "✅ Включить приветственное сообщение",
                `admin_turn_${
                  settings.allHelloMsgEnabled ? "off" : "on"
                }_allHelloMsgEnabled`
              ),
            ],
            [
              Markup.callbackButton(
                "💬 Изменить ссылку на общий чат",
                `admin_edit_allGroupLink`
              ),
            ],
            [
              Markup.callbackButton(
                "💸 Изменить ссылку на канал выплат",
                `admin_edit_payoutsChannelLink`
              ),
            ],
            [
              Markup.callbackButton(
                "💴 Изменить процент воркера за залёт",
                "admin_edit_payoutPercent"
              ),
            ],
            [Markup.callbackButton(locale.go_back, "admin")],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
