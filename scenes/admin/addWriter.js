const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const writers = require("../../commands/admin/writers");
const { User, Writer } = require("../../database");
const log = require("../../helpers/log");

const scene = new WizardScene(
  "admin_add_writer",
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите username вбивера (Формат: @username)", {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      return ctx.wizard.next();
    } catch (err) {
      await ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      ctx.message.text = ctx.message.text.replace("@", "");
      const user = await User.findOne({
        where: {
          username: ctx.message.text,
        },
      });
      if (!user) {
        await ctx.reply("❌ Пользователь не найден в боте").catch((err) => err);
        return ctx.wizard.prevStep();
      }
      await Writer.create({
        countryCode: ctx.scene.state.countryCode,
        username: user.username,
      });
      log(ctx, `добавил вбивера <b><a href="tg://user?id=${user.id}">${user.username}</a></b>`);
      await ctx.scene.reply("✅ Вбивер добавлен!").catch((err) => err);
    } catch (err) {
      await ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave((ctx) => writers(ctx));

module.exports = scene;
