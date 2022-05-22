const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const bins = require("../../commands/admin/bins");
const { Bin } = require("../../database");
const log = require("../../helpers/log");

const scene = new WizardScene(
  "admin_add_bin",
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите BIN (первые 6-8 цифр номера карты)", {
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
      const bin = parseInt(ctx.message.text);
      if (isNaN(bin)) return ctx.wizard.prevStep();
      ctx.scene.state.data.bin = bin;

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply(
        "Выберите платежную систему из списка, либо напишите текстом",
        {
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("VISA", "visa"),
              Markup.callbackButton("MASTERCARD", "mastercard"),
            ],
            [
              Markup.callbackButton("AMERICAN EXPRESS", "american_express"),
              Markup.callbackButton("DINERS CLUB", "diners_club"),
            ],
            [Markup.callbackButton("JCB", "jcb")],
            [Markup.callbackButton("Отменить", "cancel")],
          ]),
        }
      );
      return ctx.wizard.next();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (
        ["visa", "mastercard", "americanexpress", "dinersclub", "jcb"].includes(
          ctx.callbackQuery.data
        )
      ) {
        ctx.scene.state.data.scheme = ctx.callbackQuery.data
          .replace("_", " ")
          .toUpperCase();
      } else if (ctx.message.text) {
        ctx.scene.state.data.scheme = escapeHTML(
          ctx.message.text.substr(0, 128)
        );
      } else return ctx.wizard.prevStep();
      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply(`Выберите тип карты`, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton("DEBIT", "debit"),
            Markup.callbackButton("CREDIT", "credit"),
          ],
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
      if (!["debit", "credit"].includes(ctx.callbackQuery.data))
        return ctx.wizard.prevStep();
      ctx.scene.state.data.type = ctx.callbackQuery.data.toUpperCase();

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите бренд карты (пример: ELECTRON)", {
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

      ctx.scene.state.data.brand = ctx.message.text
        .substr(0, 128)
        .toUpperCase();

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите страну карты (Пример: ENGLAND)", {
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

      ctx.scene.state.data.country = ctx.message.text
        .substr(0, 128)
        .toUpperCase();

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите код валюты карты (Пример: USD)", {
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
      ctx.scene.state.data.currency = ctx.message.text
        .substr(0, 128)
        .toUpperCase();

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите название банка (Пример: SANTANDER)", {
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

      ctx.scene.state.data.bank = ctx.message.text.substr(0, 255).toUpperCase();

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const bin = await Bin.create(ctx.scene.state.data);
      log(ctx, `добавил новый БИН ${bin.bin}`);
      await ctx.reply("✅ БИН добавлен").catch((err) => err);
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave((ctx) => bins(ctx));

module.exports = scene;
