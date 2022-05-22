const { Markup } = require("telegraf");
const { Mentors } = require("../database");

module.exports = async (ctx) => {
    let mentor_1 = await Mentors.findOne({ 
        where: { 
        id: 1
     } 
    })
    let mentor_2 = await Mentors.findOne({ 
        where: { 
        id: 2
     } 
    })
    let mentor_3 = await Mentors.findOne({ 
        where: { 
        id: 3
     } 
    })
    let mentor_4 = await Mentors.findOne({ 
        where: { 
        id: 4
     } 
    })
    let mentor_5 = await Mentors.findOne({ 
        where: { 
        id: 5
     } 
    })

  return ctx.replyOrEdit(`<b>📚 Выберите наставника из списка:</b>`, {
      parse_mode: "HTML",
      reply_markup: Markup.inlineKeyboard([
        [
            Markup.callbackButton(mentor_1.username_mentor != "пусто"  ? `1. ${mentor_1.username_mentor} 👨‍🏫` : `пусто`, "mentor_1")
        ],
        [
            Markup.callbackButton(mentor_2.username_mentor != "пусто" ? `2. ${mentor_2.username_mentor} 👨‍🏫` : `пусто`, "mentor_2")
        ],
        [
            Markup.callbackButton(mentor_3.username_mentor != "пусто" ? `3. ${mentor_3.username_mentor} 👨‍🏫` : `пусто`, "mentor_3")
        ],
        [
            Markup.callbackButton(mentor_4.username_mentor != "пусто" ?`4. ${mentor_4.username_mentor} 👨‍🏫`: `пусто`, "mentor_4")
        ],
        [
            Markup.callbackButton(mentor_5.username_mentor != "пусто" ? `5. ${mentor_5.username_mentor} 👨‍🏫`: `пусто`, "mentor_5")
        ]
      ]),
    })
};