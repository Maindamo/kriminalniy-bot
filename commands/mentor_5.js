const { Markup } = require("telegraf");
const { Mentors } = require("../database");

module.exports = async (ctx) => {

    let mentor_5 = await Mentors.findOne({ 
        where: { 
        id: 5
     } 
    })

    return ctx.replyOrEdit(`<b>ℹ️ Информация о наставнике ${mentor_5.username_mentor}:</b>\n👨‍🏫 Username: @${mentor_5.username_mentor}\n🧾 Описание: <code>${mentor_5.description}</code>`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
              Markup.callbackButton(`✅ Выбрать`, "mentor_5_enter")
          ],
        ]),
      })
};