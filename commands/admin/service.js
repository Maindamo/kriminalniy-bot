const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const { Service, Ad } = require("../../database");
const locale = require("../../locale");

module.exports = async (ctx, id) => {
  try {
    const service = await Service.findByPk(id, {
      include: [
        {
          association: "country",
          required: true
        }
      ]
    });
    if (!service)
      return ctx
        .replyOrEdit("❌ Сервис не найден", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("◀️ Назад", `admin_services_1`)],
          ]),
        })
        .catch((err) => err);

    const serviceAdsCount = await Ad.count({
      where: {
        serviceCode: service.code,
      },
    });
    return ctx
      .replyOrEdit(
        `<b>📦 Сервис "${service.title}"</b>

🌎 Страна: <b>${service.country.title}</b>
🎟 Объявлений: <b>${serviceAdsCount}</b>
🔗 Активный домен: <b>${service.domain}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("📝 Изменить домен", `admin_service_${service.id}_edit_domain`),
            ],
            [
              Markup.callbackButton(
                service.status == 1 ? `👁 Скрыть сервис` : `👁 Отображать сервис`,
                `admin_service_${service.id}_${
                  service.status == 1 ? "hide" : "show"
                }`
              ),
            ],
            [Markup.callbackButton("◀️ Назад", `admin_services_1`)],
          ]),
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
