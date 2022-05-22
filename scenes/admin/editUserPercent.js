const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const user = require("../../commands/admin/user");
const { User } = require("../../database");
const log = require("../../helpers/log");

const scene = new WizardScene(
  "admin_user_edit_percent",
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите процент", {
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
      var percent = parseFloat(ctx.message.text);
      if (isNaN(percent)) {
        await ctx.reply("❌ Введите валидное число").catch((err) => err);
        return ctx.wizard.prevStep();
      }
      percent = percent.toFixed(2);
      const user = await User.findByPk(ctx.scene.state.userId);

      await user.update({
        percent,
        percentType: {
          allProfits: 1,
          logs: 2,
        }[ctx.scene.state.percentType],
      });
      log(
        ctx,
        `изменил процент для пользователя <b><a href="tg://user?id=${user.id}">${user.username}</a></b>`
      );
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave((ctx) => user(ctx, ctx.scene.state.userId));

module.exports = scene;
