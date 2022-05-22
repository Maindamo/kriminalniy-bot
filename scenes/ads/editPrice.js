const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const myAd = require("../../commands/myAd");
const { Ad } = require("../../database");
const log = require("../../helpers/log");

const scene = new WizardScene(
  "my_ad_edit_price",
  async (ctx) => {
    try {
      const ad = await Ad.findOne({
        where: {
          id: ctx.scene.state.adId,
          userId: ctx.from.id,
        },
      });
      if (!ad) {
        ctx.replyOrEdit("❌ Объявление не найдено").catch((err) => err);
        return ctx.scene.leave();
      }

      await ctx.scene.reply("💰 Введите новую цену", {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      return ctx.wizard.next();
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      var price = parseFloat(ctx.message.text);
      if (isNaN(price)) return ctx.wizard.prevStep();
      if (price % 1 == 0) price = parseInt(price);

      const ad = await Ad.findOne({
        where: {
          id: ctx.scene.state.adId,
          userId: ctx.from.id,
        },
        include: [
          {
            association: "service",
            required: true,
            include: [
              {
                association: "currency",
                required: true,
              },
            ],
          },
        ],
      });
      if (!ad) {
        ctx.replyOrEdit("❌ Объявление не найдено").catch((err) => err);
        return ctx.scene.leave();
      }
      var before_price = ad.price;
      price = `${price} ${ad.service.currency.symbol}`;

      await ad.update({
        price,
      });
      log(
        ctx,
        `изменил цену для объявления <code>(ID: ${ad.id})</code> с <b>${before_price} на ${price}</b>`
      );
    } catch (err) {
      ctx.replyOrEdit("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave((ctx) => myAd(ctx, ctx.scene.state.adId));

module.exports = scene;
