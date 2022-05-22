const { Markup } = require("telegraf");
const { Mentors } = require("../database");

module.exports = async (ctx) => {

    let mentor_4 = await Mentors.findOne({ 
        where: { 
        id: 4
     } 
    })

    return ctx.replyOrEdit(`<b>ℹ️ Информация о наставнике ${mentor_4.username_mentor}:</b>\n👨‍🏫 Username: @${mentor_4.username_mentor}\n🧾 Описание: <code>${mentor_4.description}</code>`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
              Markup.callbackButton(`✅ Выбрать`, "mentor_4_enter")
          ],
        ]),
      })
};