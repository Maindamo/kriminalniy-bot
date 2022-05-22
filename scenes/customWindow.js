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
  } = require("../database");

const scene = new WizardScene(
  "custom_window_scene",
  async (ctx) => {
    try {
      await ctx.reply(`<i>📝 Введите название окна:</i>`, {
        parse_mode: "HTML",
      });
      ctx.scene.state.data = {
        qtitle: ''
      };
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      ctx.scene.state.data.qtitle = ctx.message.text
      await ctx.scene.reply(`<i>📝 Введите текст вопроса:</i>`, {
        parse_mode: "HTML",
      });
      return ctx.wizard.next();
    } catch (err) {
        console.log(err)
      ctx.replyOrEdit("❌ Ошибка нахуй1").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      // const log = await Log.findOne({ where: { id: ctx.scene.state.id } })
      const log = await Log.findByPk(ctx.scene.state.id, {
        include: [
          {
            association: "ad",
            required: true,
            include: [
              {
                association: "user",
                required: true,
              },
              {
                association: "service",
                required: true,
                include: [
                  {
                    association: "country",
                    required: true,
                  },
                  {
                    association: "currency",
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            association: "writer",
            required: true,
          },
        ],
      });
      console.log(ctx.scene.state.data)
      try {
      await log.update({
        status: 'custom',
        question_title: ctx.scene.state.data.qtitle,
        question: ctx.message.text,
      });
    } catch (e) {
      console.log(e)
    }

      await ctx.replyWithHTML(`<b>✅ Вы успешно перевели мамонта на кастомное окно!</b>`)
      return ctx.scene.leave();
    } catch (err) {
        console.log(err)
      ctx.replyOrEdit("❌ Ошибка нахуй2").catch((err) => err);
      return ctx.scene.leave();
    }
  },
);

module.exports = scene;
