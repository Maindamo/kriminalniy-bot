const { Markup } = require("telegraf");
const { Mentors } = require("../database");

module.exports = async (ctx) => {

    let mentor_3 = await Mentors.findOne({ 
        where: { 
        id: 3
     } 
    })

    return ctx.replyOrEdit(`<b>ℹ️ Информация о наставнике ${mentor_3.username_mentor}:</b>\n👨‍🏫 Username: @${mentor_3.username_mentor}\n🧾 Описание: <code>${mentor_3.description}</code>`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
              Markup.callbackButton(`✅ Выбрать`, "mentor_3_enter")
          ],
        ]),
      })
};