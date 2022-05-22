const { Op } = require("sequelize");
const { Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const user = require("../../commands/admin/user");
const { User, Profit, Currency } = require("../../database");
const log = require("../../helpers/log");
const locale = require("../../locale");

const scene = new WizardScene(
  "admin_add_profit",
  async (ctx) => {
    try {
      await ctx.scene.reply("Введите username или ID вбивера", {
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
      ctx.message.text = ctx.message.text.replace("@", "");
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {
              username: ctx.message.text,
            },
            {
              id: ctx.message.text,
            },
          ],
        },
      });
      if (!user) {
        ctx.reply("❌ Пользователь не найден").catch((err) => err);
        return ctx.wizard.prevStep();
      }

      ctx.scene.state.data.writer = user.id;

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply(
        `Введите сумму залета (только число, в ${ctx.scene.state.currency})`,
        {
          reply_markup: Markup.inlineKeyboard([
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
      var amount = parseFloat(ctx.message.text);
      if (isNaN(amount)) return ctx.wizard.prevStep();
      amount = amount.toFixed(2);

      const currency = await Currency.findOne({
        where: {
          code: ctx.scene.state.currency,
        },
      });

      var convertedAmount = (
        parseFloat(amount) * parseFloat(currency.rub)
      ).toFixed(2);

      const profit = await Profit.create({
        userId: ctx.scene.state.userId,
        amount,
        convertedAmount,
        currency: String(currency.code).toUpperCase(),
        serviceTitle: ctx.scene.state.serviceTitle,
        writerId: ctx.scene.state.data.writer,
      });
      const profitUser = await profit.getUser(),
        profitWriter = await profit.getWriter();
      var text = locale.newProfit.channel;

      var workerAmount = (
          (parseFloat(profit.amount) / 100) *
          parseFloat(ctx.state.bot.payoutPercent)
        ).toFixed(2),
        workerConvertedAmount = (
          parseFloat(workerAmount) * parseFloat(currency.rub)
        ).toFixed(2);

      text = text
        .replace("{serviceTitle}", ctx.scene.state.serviceTitle)
        .replace(
          "{amount}",
          `${profit.amount} ${profit.currency} / ${profit.convertedAmount} RUB`
        )
        .replace(
          `{workerAmount}`,
          `${workerAmount} ${profit.currency} / ${workerConvertedAmount} RUB`
        )
        .replace(
          "{worker}",
          profitUser.hideNick
            ? "Скрыт"
            : `<a href="tg://user?id=${profit.userId}">${profitUser.username}</a>`
        )
        .replace(
          "{writer}",
          `<a href="tg://user?id=${profitWriter.id}">${profitWriter.username}</a>`
        )
        .replace("{profitId}", profit.id);
      const msg = await ctx.telegram
        .sendMessage(ctx.state.bot.payoutsChannelId, text, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton(locale.newProfit.wait, "none")],
          ]),
        })
        .catch((err) => err);
      await profit.update({
        channelMessageId: msg.message_id,
      });

      await ctx.telegram
        .sendMessage(
          profitUser.id,
          locale.newProfit.worker
            .replace("{profitId}", profit.id)
            .replace(
              "{amount}",
              `${profit.amount} ${profit.currency} / ${profit.convertedAmount} RUB`
            )
            .replace(
              `{workerAmount}`,
              `${workerAmount} ${profit.currency} / ${workerConvertedAmount} RUB`
            )
            .replace(
              "{writer}",
              `<a href="tg://user?id=${profitWriter.id}">${profitWriter.username}</a>`
            ),
          {
            parse_mode: "HTML",
          }
        )
        .catch((err) => err);
      log(
        ctx,
        `добавил новый профит #${profit.id} суммой ${profit.amount} ${profit.currency} для пользователя <b><a href="tg://user?id=${profitUser.id}">${profitUser.username}</a></b>`
      );
      await ctx.reply("✅ Профит добавлен!").catch((err) => err);
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.scene.leave();
  }
);

scene.leave((ctx) => user(ctx, ctx.scene.state.userId));

module.exports = scene;
