const WizardScene = require("telegraf/scenes/wizard");
const linkify = require("linkifyjs");
const { Markup } = require("telegraf");
const { Service } = require("../database");
// const { default: axios } = require("axios");
const menu = require("../commands/menu");
const escapeHTML = require("escape-html");
const log = require("../helpers/log");
const qs = require('qs');
const axios = require('axios')

const scene = new WizardScene(
  "sendSmsPhone",
  async (ctx) => {
    try {
      await ctx.scene.reply("🌎 Выберите страну для отправки:", {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton("🏴󠁧󠁢󠁥󠁮󠁧󠁿 Великобритания", "Великобритания"),
          ],
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
      log(ctx, `перешел к отправке СМС сообщения мамонту`)
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
      if(["Румыния"].includes(ctx.callbackQuery.data)) {
        await ctx.replyOrEdit(`🇷🇴 Выберите сервис для отправки сообщения:`, {
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
        return ctx.wizard.next();
      } else if(["Сербия"].includes(ctx.callbackQuery.data)) {
        await ctx.replyOrEdit(`🇷🇸 Выберите сервис для отправки сообщения:`, {
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
        return ctx.wizard.next();
      } else if(["Австралия"].includes(ctx.callbackQuery.data)) {
        await ctx.replyOrEdit(`🇦🇺 Выберите сервис для отправки сообщения:`, {
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
        return ctx.wizard.next();
      } else if(["Италия"].includes(ctx.callbackQuery.data)) {
        await ctx.replyOrEdit(`🇮🇹 Выберите сервис для отправки сообщения:`, {
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
        return ctx.wizard.next();
      } else if(["Великобритания"].includes(ctx.callbackQuery.data)) {
        await ctx.replyOrEdit(`🏴󠁧󠁢󠁥󠁮󠁧󠁿 Выберите сервис для отправки сообщения:`, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.callbackButton("🏴󠁧󠁢󠁥󠁮󠁧󠁿 Великобритания 1.0", "Великобритания_1"),
              Markup.callbackButton("🏴󠁧󠁢󠁥󠁮󠁧󠁿 Великобритания 2.0", "Великобритания_2")
            ],
            [
              Markup.callbackButton("Возврат 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Великобритания", "Возврат_Великобритания"),
            ],
            [
              Markup.callbackButton("Недвижимость 1.0", "Великобритания_недвижимость")
            ],
            [
              Markup.callbackButton("Недвижимость 2.0", "Великобритания_недвижимость2")
            ],
            [
              Markup.callbackButton("Blablacar 1.0", "Великобритания_ббк")
            ],
            [
              Markup.callbackButton("Blablacar 2.0", "Великобритания_ббк2")
            ],
            [
              Markup.callbackButton("Почта 1.0", "Великобритания_почта")
            ],
            [
              Markup.callbackButton("Отменить", "cancel")
            ]
          ]),
        });
        log(ctx, `выбрал ссылку для страны ${ctx.callbackQuery.data}`)
        return ctx.wizard.next();
      }
    } catch (err) {
      console.log(err);
      return ctx.wizard.prevStep();
      ctx.reply("❌ Ошибка").catch((err) => err);
    }
  },
  async (ctx) => {
    try {
      if(ctx.callbackQuery.data == "cancel") return ctx.scene.leave()
      await ctx.scene.reply("📲 Введите номер телефона мамонта:", {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Отменить", "cancel")],
        ]),
      });
      ctx.scene.state.data.service = ctx.callbackQuery.data;
      return ctx.wizard.next();
    } catch (err) {
      return ctx.wizard.prevStep();
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
      let filter = /(qa-pay.eu)/
      if(!filter.test(ctx.message.text.toLowerCase())) {
         await ctx.reply(`Сыну мертвой шлюхи смс не доступно. Идите в свою канаву`)
         log(ctx, `хуесос попытался отправить ссылку другой тимы - ${ctx.message.text} (или это опечатка)`)
         return ctx.scene.leave()
      }
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
      // [
      //   { code: 'RU', name: '🇷🇺 Россия'  , number_example: '79157325697' },
      //   { code: 'UA', name: '🇺🇦 Украина'  , number_example: '380915797017' },
      //   { code: 'PL', name: '🇵🇱 Польша'  , number_example: '48667535999' },
      //   { code: 'RO', name: '🇷🇴 Румыния'  , number_example: '40786377233' },
      //   { code: 'ES', name: '🇪🇸 Испания'  , number_example: '34631881827' },
      //   {
      //     code: 'UK',
      //     name: '🇬🇧 Великобритания'  ,
      //     number_example: '447404240974'
      //   },
      //   { code: 'BY', name: '🇧🇾 Беларусь'  , number_example: '375445826502' },
      //   { code: 'MD', name: '🇲🇩 Молдова'  , number_example: '37368182013' },
      //   { code: 'IT', name: '🇮🇹 Италия'  , number_example: '393393456622' },
      //   { code: 'LV', name: '🇱🇻 Латвия'  , number_example: '37128133932' },
      //   {
      //     code: 'DE',
      //     name: '🇩🇪 Германия'  ,
      //     number_example: '4915175470511'
      //   },
      //   { code: 'KG', name: '🇰🇬 Киргизия'  , number_example: '996999422222' },
      //   {
      //     code: 'PT',
      //     name: '🇵🇹 Португалия'  ,
      //     number_example: '351912865584'
      //   },
      //   { code: 'RS', name: '🇷🇸 Сербия'  , number_example: '381631603983' },
      //   { code: 'AU', name: '🇦🇺 Австралия'  , number_example: '61480050219' },
      //   { code: 'FR', name: '🇫🇷 Франция'  , number_example: '33757130019' }
      // ]
      if(ctx.callbackQuery.data == 'cancel') {
         return ctx.scene.leave()
      }
      if(ctx.callbackQuery.data == 'Отправить') {
       // code
      //  [
      //   Markup.callbackButton("Недвижимость 1.0", "Италия_недвижимость")
      // ],
      // [
      //   Markup.callbackButton("Недвижимость 2.0", "Италия_недвижимость2")
      // ],
      // [
      //   Markup.callbackButton("Blablacar 1.0", "Италия_ббк")
      // ],
      // [
      //   Markup.callbackButton("Blablacar 2.0", "Италия_ббк2")
      // ],
      // [
      //   Markup.callbackButton("Почта 1.0", "Италия_почта")
      // ],
      await ctx.replyOrEdit(`⏰ <i>Отправляем сообщение...</i>`, {
        parse_mode: "HTML"
      })
       if(ctx.scene.state.data.service == 'Италия_1') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 25, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Италия_2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 26, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Возврат_Италия') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 27, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Италия_недвижимость') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 84, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Италия_недвижимость2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 85, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Италия_ббк') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 86, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Италия_ббк2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 87, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Италия_почта') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 128, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       }

       if(ctx.scene.state.data.service == 'Великобритания_1') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 16, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Великобритания_2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 17, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Возврат_Великобритания') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 18, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Великобритания_недвижимость') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 72, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Великобритания_недвижимость2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 73, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Великобритания_ббк') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 74, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Великобритания_ббк2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 75, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Великобритания_почта') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 125, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       }

       // ----------------------------------------------------- NEXT --------------------------------------------------- \\

       if(ctx.scene.state.data.service == 'Румыния_1') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 10, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Румыния_2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 11, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Возврат_Румыния') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 12, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Румыния_недвижимость') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 64, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Румыния_недвижимость2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 65, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Румыния_ббк') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 66, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Румыния_ббк2') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 67, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       } else if(ctx.scene.state.data.service == 'Румыния_почта') {
        let data = { 'key': "Ksi3SuRrPnZsfh30tiJvZRNLOximzi", 'number': `${ctx.scene.state.data.number}`, 'template_id': 123, 'link': `${ctx.scene.state.data.link}`  };
        
            let url = 'https://sender.getsms.shop/send'
            const options = {
              method: 'POST',
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: new URLSearchParams(data),
              url,
            };
        
            await axios(options)
            // console.log(req.data.find(x=> x.id == 25))
       }
       await ctx.replyOrEdit(`✅ <b>Ваше сообщение было успешно отправлено мамонту.</b>`, {
         parse_mode: "HTML"
       })
       log(ctx, `
       
⚡️Лог об отправке смс

🚀Воркер: @${ctx.from.username}
🚀Номер мамонта: ${ctx.scene.state.data.number}
🚀Ссылка: ${ctx.scene.state.data.link}`)
      }
    } catch (err) {
      console.log(err)
      ctx.reply("❌ Ошибка").catch((err) => err);
      return ctx.scene.leave();
    }
  },
);

scene.leave(menu);

module.exports = scene;
