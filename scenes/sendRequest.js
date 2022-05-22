const WizardScene = require("telegraf/scenes/wizard");
const { Request } = require("../database");
const locale = require("../locale");
const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const log = require("../helpers/log");
const { Writer, Country, Ad, User, Settings, Profit } = require("../database");

const scene = new WizardScene(
  "send_request",
  async (ctx) => {
    try {
      log(ctx, "перешёл к заполнению заявки");
      await ctx.scene.reply(locale.requests.steps[0].scene_text, {
        parse_mode: "HTML",
      });
      ctx.scene.state.data = {};
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй1").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      log(ctx, "перешёл ко второму шагу заполнения заявки");
      ctx.scene.state.data.step1 = escapeHTML(
        ctx.message.text.replace(/\s+/g, " ").substr(0, 600)
      );
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй2").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply(locale.requests.steps[1].scene_text, {
        parse_mode: "HTML",
      });
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй3").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      log(ctx, "перешёл к третьему шагу заполнения заявки");
      ctx.scene.state.data.step2 = escapeHTML(
        ctx.message.text.replace(/\s+/g, " ").substr(0, 600)
      );
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй4").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply(locale.requests.steps[2].scene_text, {
        parse_mode: "HTML",
      });
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка нахуй5").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    const settings = await Settings.findByPk(1);
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      ctx.scene.state.data.step3 = escapeHTML(
        ctx.message.text.replace(/\s+/g, " ").substr(0, 600)
      );
      const request = await Request.create({
        userId: ctx.from.id,
        ...ctx.scene.state.data,
      });
      log(ctx, "отправил заявку на рассмотрение");
      ctx.telegram.sendMessage(
        settings.requestsGroupId,
        `ℹ️ Новая заявка от пользователя <b><a href="tg://user?id=${ctx.from.id}">${ctx.state.user.username}</a></b>
      
🚦 Статус: <b>На рассмотрении ⏳</b>

${locale.requests.steps[0].request_text}: <b>${request.step1}</b>
${locale.requests.steps[1].request_text}: <b>${request.step2}</b>
${locale.requests.steps[2].request_text}: <b>${request.step3}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton(
                "✅ Принять",
                `admin_request_${request.id}_accept`
              ),
              Markup.callbackButton(
                "❌ Отклонить",
                `admin_request_${request.id}_decline`
              ),
            ],
          ]),
        }
      );
      await ctx.scene.reply(locale.requests.done, {
        parse_mode: "HTML",
      });
    } catch (err) {
      console.log(err)
      ctx.replyOrEdit("❌ Ошибка нахуй6").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

module.exports = scene;
