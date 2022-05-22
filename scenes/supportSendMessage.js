const escapeHTML = require("escape-html");
const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const { SupportChat } = require("../database");

const scene = new WizardScene(
  "support_send_message",
  async (ctx) => {
    try {
      if (ctx.updateType == "callback_query")
        await ctx.answerCbQuery().catch((err) => err);
      ctx.updateType = "message";
      await ctx.scene.reply("Введите сообщение для отправки", {
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

      await SupportChat.create({
        messageFrom: 0,
        supportId: ctx.scene.state.supportId,
        message: escapeHTML(ctx.message.text),
        messageId: ctx.message.message_id,
      });

      await ctx.scene
        .reply("✅ Сообщение отправлено!", {
          reply_to_message_id: ctx.message.message_id,
        })
        .catch((err) => err);
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave(
  (ctx) =>
    ctx.updateType == "callback_query" &&
    ctx.deleteMessage().catch((err) => err)
);

module.exports = scene;
