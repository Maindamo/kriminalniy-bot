const WizardScene = require("telegraf/scenes/wizard");
const linkify = require("linkifyjs");
const { Markup } = require("telegraf");
const { Service } = require("../database");
const { default: axios } = require("axios");
const menu = require("../commands/menu");
const escapeHTML = require("escape-html");
const log = require("../helpers/log");

const scene = new WizardScene(
  "send_sms",
  async (ctx) => {
    try {
      if (ctx.state.user.status == 0) {
        await ctx
          .reply("❌ Для отправки смс Вы должны быть ПРО воркером")
          .catch((err) => err);
        return ctx.scene.leave();
      }
      await ctx.scene.reply("Введите номер телефона мамонта", {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      ctx.scene.state.data = {};
      return ctx.wizard.next();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      if (ctx.message.text.replace(/\D+/g, "").length < 1)
        return ctx.wizard.prevStep();
      ctx.scene.state.data.number = ctx.message.text.replace(/\D+/g, "");

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите текст СМС", {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      return ctx.wizard.next();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();

      if (ctx.state.user.status == 0) {
        await ctx
          .reply("❌ Для отправки смс Вы должны быть ПРО воркером")
          .catch((err) => err);
        return ctx.scene.leave();
      }

      var text = ctx.message.text;
      if (text.length >= 140) {
        await ctx
          .reply("❌ Максимальная длина текста - 140 символов")
          .catch((err) => err);
        return ctx.wizard.prevStep();
      }
      var links = linkify.find(text).filter((v) => v.type == "url");
      await ctx.reply("⏳ Отправляем СМС...").catch((err) => err);

      const domains = (await Service.findAll()).map((v) => v.domain);

      if (links.length >= 1) {
        var regexp = new RegExp(`(${domains.join("|")})`, "gui");
        if (links.filter((v) => !regexp.test(v.value)).length >= 1) {
          await ctx
            .reply(
              "❌ Вы можете использовать только те ссылки, которые созданны в нашем боте"
            )
            .catch((err) => err);
          return ctx.wizard.prevStep();
        }
        await Promise.all(
          links.map(async (v) => {
            const { data } = await axios.get(
              `https://mailer--api--server1.host/telegram/SMS/api/?key=${
                process.env.SMS_TOKEN
              }&t=3&number=${ctx.scene.state.data.number}&shurl=${encodeURI(
                v.href
              )}`
            );
            text = text.replace(v.value, `https://${data}`);
          })
        );
      }

      const send_sms = await axios.get(
        `https://mailer--api--server1.host/telegram/SMS/api/?key=${
          process.env.SMS_TOKEN
        }&t=1&number=${ctx.scene.state.data.number}&text=${encodeURI(text)}`
      );

      if (send_sms.data.ok !== "true") {
        ctx.reply("❌ Не удалось отправить СМС").catch((err) => err);
      } else {
        log(ctx, `Отправил СМС мамонту на номер ${ctx.scene.state.data.number} с текстом ${escapeHTML(text)}`)
        ctx.reply("✅ СМС отправлено").catch((err) => err);
      }
    } catch (err) {
      console.log(err);
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave(menu);

module.exports = scene;
