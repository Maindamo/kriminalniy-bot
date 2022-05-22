const WizardScene = require("telegraf/scenes/wizard");
const linkify = require("linkifyjs");
const { Markup } = require("telegraf");
const { Service } = require("../database");
const { default: axios } = require("axios");
const menu = require("../commands/menu");
const escapeHTML = require("escape-html");
const log = require("../helpers/log");

const scene = new WizardScene(
  "sendSmsPhone",
  async (ctx) => {
    try {
      await ctx.scene.reply("🌎 Выберите страну для отправки:", {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton("🇷🇴 Румыния", "Румыния"),
            Markup.callbackButton("🇷🇸 Сербия", "Сербия")
          ],
          [
            Markup.callbackButton("🇦🇺 Австралия", "Австралия"),
            Markup.callbackButton("🇮🇹 Италия", "Италия")
          ],
          [
            Markup.callbackButton("Отменить", "cancel")
          ]
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
      // if (!ctx.message.text) return ctx.wizard.prevStep();
      if (!["Румыния", "Сербия", "Австралия", "Италия"].includes(ctx.callbackQuery.data)) return ctx.wizard.prevStep();
      if(["Румыния"].includes(ctx.callbackQuery.data)) {
        return ctx.replyOrEdit(`🇷🇴 Выберите сервис для отправки сообщения:`, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("🇷🇴 Румыния 1.0", "Румыния_1"),
              Markup.callbackButton("🇷🇴 Румыния 2.0", "Румыния_2")
            ],
            [
              Markup.callbackButton("Возврат 🇷🇴 Румыния", "Возврат_румыния"),
            ],
            [
              Markup.callbackButton("Недвижимость 1.0", "Румыния_недвижимость")
            ],
            [
              Markup.callbackButton("Недвижимость 2.0", "Румыния_недвижимость2")
            ],
            [
              Markup.callbackButton("Blablacar 1.0", "Румыния_ббк")
            ],
            [
              Markup.callbackButton("Blablacar 2.0", "Румыния_ббк2")
            ],
            [
              Markup.callbackButton("Почта 1.0", "Румыния_почта")
            ],
            [
              Markup.callbackButton("Отменить", "cancel")
            ]
          ]),
        });
      } else if(["Сербия"].includes(ctx.callbackQuery.data)) {
        return ctx.replyOrEdit(`🇷🇸 Выберите сервис для отправки сообщения:`, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("🇷🇸 Сербия 1.0", "Сербия_1"),
              Markup.callbackButton("🇷🇸 Сербия 2.0", "Сербия_2")
            ],
            [
              Markup.callbackButton("Возврат 🇷🇸 Сербия", "Возврат_Сербия"),
            ],
            [
              Markup.callbackButton("Недвижимость 1.0", "Сербия_недвижимость")
            ],
            [
              Markup.callbackButton("Недвижимость 2.0", "Сербия_недвижимость2")
            ],
            [
              Markup.callbackButton("Blablacar 1.0", "Сербия_ббк")
            ],
            [
              Markup.callbackButton("Blablacar 2.0", "Сербия_ббк2")
            ],
            [
              Markup.callbackButton("Почта 1.0", "Сербия_почта")
            ],
            [
              Markup.callbackButton("Отменить", "cancel")
            ]
          ]),
        });
      } else if(["Австралия"].includes(ctx.callbackQuery.data)) {
        return ctx.replyOrEdit(`🇦🇺 Выберите сервис для отправки сообщения:`, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("🇦🇺 Австралия 1.0", "Австралия_1"),
              Markup.callbackButton("🇦🇺 Австралия 2.0", "Австралия_2")
            ],
            [
              Markup.callbackButton("Возврат 🇦🇺 Австралия", "Возврат_Австралия"),
            ],
            [
              Markup.callbackButton("Недвижимость 1.0", "Австралия_недвижимость")
            ],
            [
              Markup.callbackButton("Недвижимость 2.0", "Австралия_недвижимость2")
            ],
            [
              Markup.callbackButton("Blablacar 1.0", "Австралия_ббк")
            ],
            [
              Markup.callbackButton("Blablacar 2.0", "Австралия_ббк2")
            ],
            [
              Markup.callbackButton("Почта 1.0", "Австралия_почта")
            ],
            [
              Markup.callbackButton("Отменить", "cancel")
            ]
          ]),
        });
      } else if(["Италия"].includes(ctx.callbackQuery.data)) {
        return ctx.replyOrEdit(`🇮🇹 Выберите сервис для отправки сообщения:`, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("🇮🇹 Италия 1.0", "Италия_1"),
              Markup.callbackButton("🇮🇹 Италия 2.0", "Италия_2")
            ],
            [
              Markup.callbackButton("Возврат 🇮🇹 Италия", "Возврат_Италия"),
            ],
            [
              Markup.callbackButton("Недвижимость 1.0", "Италия_недвижимость")
            ],
            [
              Markup.callbackButton("Недвижимость 2.0", "Италия_недвижимость2")
            ],
            [
              Markup.callbackButton("Blablacar 1.0", "Италия_ббк")
            ],
            [
              Markup.callbackButton("Blablacar 2.0", "Италия_ббк2")
            ],
            [
              Markup.callbackButton("Почта 1.0", "Италия_почта")
            ],
            [
              Markup.callbackButton("Отменить", "cancel")
            ]
          ]),
        });
      }
    } catch (err) {
      console.log(err);
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
    return ctx.wizard.next();
  },
  async (ctx) => {
    try {
      if(ctx.callbackQuery.data == "cancel") return ctx.scene.leave()
      if (ctx.message.text) return ctx.wizard.prevStep();
      await ctx.scene.reply("📲 Введите номер телефона мамонта:", {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      ctx.scene.state.data.service = ctx.callbackQuery.data;
      return ctx.wizard.next();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
      if (ctx.message.text.replace(/\D+/g, "").length < 1)
        return ctx.wizard.prevStep();
      ctx.scene.state.data.number = ctx.message.text.replace(/\D+/g, "");

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      await ctx.scene.reply("🔗 Введите ссылку, которая должна быть в сообщении:", {
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
      ctx.scene.state.data.link = ctx.message.text

      return ctx.wizard.nextStep();
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      if (!ctx.message.text) return ctx.wizard.prevStep();
    await ctx.replyOrEdit(`<b>ℹ️ Предпросмотр:</b>

📲 Номер: ${ctx.scene.state.data.number}
📁 Сервис: ${ctx.scene.state.data.service}
🔗 Ссылка: ${ctx.scene.state.data.link}

<i>📌 Чтобы отправить сообщение мамонту, нажмите на кнопку ниже.</i>
      `, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отправить", "Отправить")],
          [Markup.callbackButton("Отмена", "cancel")],
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
      if (ctx.message.text) return ctx.wizard.prevStep();
      if(ctx.callbackQuery.data == 'cancel') {
         return ctx.scene.leave()
      }
      if(ctx.callbackQuery.data == 'Отправить') {
       // code
       await ctx.replyOrEdit(`✅ <b>Ваше сообщение было успешно отправлено мамонту.</b>`, {
         parse_mode: "HTML"
       })
      }
    } catch (err) {
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
);

scene.leave(menu);

module.exports = scene;
