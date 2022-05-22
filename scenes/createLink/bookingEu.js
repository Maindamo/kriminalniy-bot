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
const downloadImage = require("../../helpers/downloadImage");

const scene = new WizardScene(
  "create_link_booking_eu",
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: "booking_eu",
        },
      });
      if (!service) {
        await ctx.scene.reply("❌ Сервис не существует").catch((err) => err);
        return ctx.scene.leave();
      }
      ctx.scene.state.data = {};
      log(ctx, "перешёл к созданию ссылки BOOKING.COM");
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите название квартиры", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("Отменить", "cancel")],
          ]),
        })
        .catch((err) => err);
      return ctx.wizard.next();
    } catch (err) {
      console.log(err)
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.callbackQuery.data) return ctx.wizard.prevStep();

      ctx.scene.state.data.title = escapeHTML(ctx.message.text);
      return ctx.wizard.nextStep();
    } catch (err) {
      // console.log(err)
      // ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      ctx.scene.state.data.title = escapeHTML(ctx.message.text);
      return ctx.wizard.nextStep();
      // return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите цену квартиры (только число, в EURO)", {
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

      amount = amount + " €";

      ctx.scene.state.data.price = amount;

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },

  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите дату заезда", {
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
      // if (!ctx.callbackQuery.data) return ctx.wizard.prevStep();
      ctx.scene.state.data.zaezd = ctx.message.text;
      return ctx.wizard.nextStep();
    } catch (err) {
      return ctx.wizard.prevStep();
      // ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      // return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите дату выезда", {
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
      // if (!ctx.callbackQuery.data) return ctx.wizard.prevStep();
      ctx.scene.state.data.viezd = ctx.message.text;
      return ctx.wizard.nextStep();
    } catch (err) {
      return ctx.wizard.prevStep();
      // ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      // return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Отправьте изображение в сжатом формате", {
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
      if (ctx.callbackQuery.data == "skip") return ctx.wizard.nextStep();
      if (ctx.message.photo.length < 1 && ctx.callbackQuery.data !== "skip") return ctx.wizard.prevStep();
    } catch (err) {
      // console.log(err)
      const photo_link = await ctx.telegram.getFileLink(
        ctx.message.photo[0].file_id
      );
      ctx.wizard.state.data.photo = await downloadImage(photo_link);
      // ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.wizard.nextStep();
    }
  },
  async (ctx) => {
    try {
      await ctx
        .reply("Чекер баланса", {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("Включить", "true"),
              Markup.callbackButton("Выключить", "false"),
            ],
            [Markup.callbackButton("Отменить", "cancel")],
          ]),
        })
        .catch((err) => err);
      return ctx.wizard.next();
    } catch (err) {
      console.log(err)
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!["true", "false"].includes(ctx.callbackQuery.data)) return ctx.wizard.prevStep();
      ctx.scene.state.data.balanceChecker = ctx.callbackQuery.data == "true";
      return ctx.wizard.nextStep()
    } catch (err) {
      console.log(err)
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  // async (ctx) => {
  //   try {
  //     await ctx.scene
  //       .reply("Чекер баланса", {
  //         reply_markup: Markup.inlineKeyboard([
  //           [
  //             Markup.callbackButton("Включить", "true"),
  //             Markup.callbackButton("Выключить", "false"),
  //           ],
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
  //     if (!["true", "false"].includes(ctx.callbackQuery.data))
  //       return ctx.wizard.prevStep();
  //     ctx.scene.state.data.balanceChecker = ctx.callbackQuery.data == "true";
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
          code: "booking_eu",
        },
      });
      if (!service) {
        await ctx.scene.reply("❌ Сервис не существует").catch((err) => err);
        return ctx.scene.leave();
      }
      console.log(ctx.scene.state.data)
      const ad = await Ad.create({
        id: parseInt(rand(999999, 99999999) + new Date().getTime() / 10000),
        userId: ctx.from.id,
        ...ctx.scene.state.data,
        serviceCode: "booking_eu",
      });

      log(ctx, `создал объявление BOOKING.COM <code>(ID: ${ad.id})</code>`);
      await ctx.scene.reply(
        `<b>✅ Ссылка 🇩🇰 BOOKING.COM сгенерирована!</b>
      
🔗 Оплата: <b>https://${service.domain}/${ad.id}</b>
🔗 Возврат: <b>https://${service.domain}/refund/${ad.id}</b>`,
        {
          parse_mode: "HTML",
        }
      );
      ctx.updateType = "message";
    } catch (err) {
      console.log(err)
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave(menu);

module.exports = scene;
