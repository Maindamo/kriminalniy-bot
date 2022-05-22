const { Markup } = require("telegraf");
const { Mentors } = require("../database");

module.exports = async (ctx) => {

    let mentor_1 = await Mentors.findOne({ 
        where: { 
        id: 1
     } 
    })

  return ctx.replyOrEdit(`<b>ℹ️ Информация о наставнике ${mentor_1.username_mentor}:</b>\n👨‍🏫 Username: @${mentor_1.username_mentor}\n🧾 Описание: <code>${mentor_1.description}</code>`, {
      parse_mode: "HTML",
      reply_markup: Markup.inlineKeyboard([
        [
            Markup.callbackButton(`✅ Выбрать`, "mentor_1_enter")
        ],
      ]),
    })
};