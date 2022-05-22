const { Markup } = require("telegraf");
const { Writer } = require("../../database");
const paginateButtons = require("../../helpers/paginateButtons");
const locale = require("../../locale");
const chunk = require("chunk");

module.exports = async (ctx, page = 1) => {
  try {
    const writers = await Writer.paginate({
      pageIndex: parseInt(page),
      pageSize: 30,
      orders: [["createdAt", "asc"]],
      include: [
        {
          association: "country",
          required: true,
        },
      ],
    });

    var buttons = chunk(
      writers.data.map((v) =>
        Markup.callbackButton(
          `${v.country.title} | ${v.username}`,
          `admin_writer_${v.id}`
        )
      ),
      3
    );

    if (buttons.length < 1)
      buttons = [[Markup.callbackButton("Страница пуста", "none")]];

    return ctx
      .replyOrEdit(`✍️ Список вбиверов (Всего: ${writers.meta.total})`, {
        reply_markup: Markup.inlineKeyboard([
          ...buttons,
          paginateButtons(writers.meta, "admin_writers_"),
          [Markup.callbackButton("✍️ Добавить вбивера", "admin_add_writer")],
          [Markup.callbackButton(locale.go_back, "admin")],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
