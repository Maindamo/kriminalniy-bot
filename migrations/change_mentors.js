const WizardScene = require("telegraf/scenes/wizard");
const locale = require("../locale");
const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const log = require("../helpers/log");
const {
    Settings,
    User,
    Ad,
    Service,
    Profit,
    Country,
    Writer,
    Request,
    Bin,
    Log,
    Mentors
  } = require("../database");

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

const scene = new WizardScene(
  "change_mentors_scene",
  async (ctx) => {
    try {
      await ctx.reply(`<i>📝 Выберите какого наставника поменять:</i>`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
            [
                Markup.callbackButton(mentor_1.username_mentor  ? `1. ${mentor_1.username_mentor} 👨‍🏫` : `пусто`, "mentor_change_1")
            ],
            [
                Markup.callbackButton(mentor_2.username_mentor ? `2. ${mentor_2.username_mentor} 👨‍🏫` : `пусто`, "mentor_change_2")
            ],
            [
                Markup.callbackButton(mentor_3.username_mentor ? `3. ${mentor_3.username_mentor} 👨‍🏫` : `пусто`, "mentor_change_3")
            ],
            [
                Markup.callbackButton(mentor_4.username_mentor ?`4. ${mentor_4.username_mentor} 👨‍🏫`: `пусто`, "mentor_change_4")
            ],
            [
                Markup.callbackButton(mentor_5.username_mentor ? `5. ${mentor_5.username_mentor} 👨‍🏫`: `пусто`, "mentor_change_5")
            ]
          ]),
      });
      ctx.scene.state.data = {
        username: '',
        desc: '',
        mentor_num: null,
      };
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if(["mentor_change_1"].includes(ctx.callbackQuery.data)) {
        ctx.scene.state.data.mentor_num = 1
        await ctx.reply(`✅ Вы выбрали первую позицию для изменения наставника.\n👨‍💻 Введите username наставника:`)

    } else if(["mentor_change_2"].includes(ctx.callbackQuery.data)) {

        ctx.scene.state.data.mentor_num = 2
        await ctx.reply(`✅ Вы выбрали вторую позицию для изменения наставника.\n👨‍💻 Введите username наставника:`)
    } else if(["mentor_change_3"].includes(ctx.callbackQuery.data)) {

        ctx.scene.state.data.mentor_num = 3
        await ctx.reply(`✅ Вы выбрали третью позицию для изменения наставника.\n👨‍💻 Введите username наставника:`)
    } else if(["mentor_change_4"].includes(ctx.callbackQuery.data)) {

        ctx.scene.state.data.mentor_num = 4
        await ctx.reply(`✅ Вы выбрали четвёртую позицию для изменения наставника.\n👨‍💻 Введите username наставника:`)
    } else if(["mentor_change_5"].includes(ctx.callbackQuery.data)) {
        ctx.scene.state.data.mentor_num = 5
        await ctx.reply(`✅ Вы выбрали пятую позицию для изменения наставника.\n👨‍💻 Введите username наставника:`)
    }
      return ctx.wizard.next();
    } catch (err) {
        console.log(err)
        return ctx.wizard.prevStep();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      // const log = await Log.findOne({ where: { id: ctx.scene.state.id } })
      ctx.scene.state.data.username = ctx.message.text;
      await ctx.replyWithHTML(`📁 Теперь введите описание наставника:`)
      return ctx.wizard.next();
    } catch (err) {
        console.log(err)
        return ctx.wizard.prevStep();
    }
},
    async (ctx) => {
        try {
          if (!ctx.message.text) return ctx.wizard.prevStep();
          // const log = await Log.findOne({ where: { id: ctx.scene.state.id } })
          await Mentors.update({
              username: ctx.scene.state.data.username,
              description: ctx.scene.state.data.description
          }, {
              where: {
                  id: ctx.scene.state.data.mentor_num
              }
          })
          await ctx.replyWithHTML(`<i>✅ Вы успешно добавили наставника.</i>`)
          return ctx.scene.leave();
        } catch (err) {
            console.log(err)
            await ctx.reply(`❌ Ошибка`)
            return ctx.scene.leave()
        }
  },
);

module.exports = scene;
