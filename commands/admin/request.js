const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Request } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id, userId = null) => {
  try {
    const request = await Request.findOne({
      where: {
        id,
      },
      include: [
        {
          association: "user",
          required: true,
        },
      ],
    });
    if (!request)
      return ctx
        .replyOrEdit("❌ Заявка не найдена", {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                "◀️ Назад",
                userId ? `admin_user_${userId}` : `admin_requests_1`
              ),
            ],
          ]),
        })
        .catch((err) => err);

    return ctx
      .replyOrEdit(
        `📰 Заявка #${request.id}
      
👤 Пользователь: <b><a href="tg://user?id=${request.user.id}">${
          request.user.username
        }</a></b>
🥇 ${locale.requests.steps[0].request_text}: <b>${escapeHTML(request.step1)}</b>
🥈 ${locale.requests.steps[1].request_text}: <b>${escapeHTML(request.step2)}</b>
🥉 ${locale.requests.steps[2].request_text}: <b>${escapeHTML(request.step3)}</b>

🚦 Статус: <b>${
          request.status == 0
            ? "⏳ На рассмотрении"
            : request.status == 1
            ? "✅ Принято"
            : "❌ Отклонено"
        }</b>`,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          disable_notification: true,
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                `✅ Принято`,
                `admin_${userId ? `user_${userId}_` : ``}request_${
                  request.id
                }_accept`
              ),
              Markup.callbackButton(
                `❌ Отклонено`,
                `admin_${userId ? `user_${userId}_` : ``}request_${
                  request.id
                }_decline`
              ),
            ],
            [
              Markup.callbackButton(
                "◀️ Назад",
                userId ? `admin_user_${userId}` : `admin_requests_1`
              ),
            ],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
