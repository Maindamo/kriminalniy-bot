const { Markup } = require("telegraf");
const { Mentors } = require("../database");

module.exports = async (ctx) => {

    let mentor_2 = await Mentors.findOne({ 
        where: { 
        id: 2
     } 
    })

    return ctx.replyOrEdit(`<b>ℹ️ Информация о наставнике ${mentor_2.username_mentor}:</b>\n👨‍🏫 Username: @${mentor_2.username_mentor}\n🧾 Описание: <code>${mentor_2.description}</code>`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
              Markup.callbackButton(`✅ Выбрать`, "mentor_2_enter")
          ],
        ]),
      })
};