const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Writer } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id) => {
  try {
    const writer = await Writer.findOne({
      where: {
        id,
      },
      include: [
        {
          association: "country",
          required: true,
        },
      ],
    });
    if (!writer)
      return ctx
        .replyOrEdit("❌ Вбивер не найден", {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                "◀️ Назад",
                `admin_writers_1`
              ),
            ],
          ]),
        })
        .catch((err) => err);

    var text = `<b>✍️ Вбивер страны "${writer.country.title}"</b>

👤 Вбивер: <b><a href="https://t.me/${writer.username}">${writer.username}</a></b>`;

    return ctx
      .replyOrEdit(text, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        disable_notification: true,
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton(
              `❌ Убрать вбивера из списка`,
              `admin_writer_${writer.id}_delete`
            ),
          ],
          [Markup.callbackButton("◀️ Назад", `admin_writers_1`)],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
