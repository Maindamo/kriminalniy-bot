const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const settings = require("../../commands/admin/settings");
const log = require("../../helpers/log");

const scene = new WizardScene(
  "admin_edit_value",
  async (ctx) => {
    try {
      await ctx.scene.reply("✍️ Введите новое значение", {
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
      var { column } = ctx.scene.state;

      if (["allGroupLink", "payoutsChannelLink"].includes(column)) {
        try {
          new URL(ctx.message.text);
        } catch (err) {
          await ctx.reply("❌ Вы ввели невалидный URL").catch((err) => err);
          return ctx.wizard.prevStep();
        }
      }
      if (["payoutPercent"].includes(column)) {
        var amount = parseFloat(ctx.message.text);
        if (isNaN(amount)) {
          await ctx.reply("❌ Вы ввели невалидное число").catch((err) => err);
          return ctx.wizard.prevStep();
        }
        ctx.message.text = amount.toFixed(2);
      }
      await ctx.state.bot.update({
        [column]: ctx.message.text,
      });
      log(
        ctx,
        `изменил значение параметра <code>${column}</code> на <code>${escapeHTML(
          ctx.message.text
        )}</code>`
      );
      await ctx.scene.reply("✅ Значение изменено").catch((err) => err);
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave(settings);

module.exports = scene;
