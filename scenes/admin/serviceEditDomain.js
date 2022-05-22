const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const service = require("../../commands/admin/service");
const { Service } = require("../../database");
const log = require("../../helpers/log");

const scene = new WizardScene(
  "admin_service_edit_domain",
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите новый домен", {
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
      const service = await Service.findByPk(ctx.scene.state.id);

      await service.update({
        domain: ctx.message.text.substr(0, 255),
      });
      log(ctx, `изменил домен для сервиса ${service.title}`);
      await ctx.reply("✅ Домен сервиса изменён!").catch((err) => err);
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave((ctx) => service(ctx, ctx.scene.state.id));

module.exports = scene;
