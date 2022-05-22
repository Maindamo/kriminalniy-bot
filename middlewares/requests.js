const requests = require("../commands/requests");
const locale = require("../locale");

module.exports = async (ctx, next) => {
  try {
    // if (!ctx.state.bot.requestsEnabled) return next();
    if (ctx.state.user.status == 1) return next();
    const request = await ctx.state.user.getRequest();
    if (
      !request &&
      ctx.chat.id == ctx.from.id
    )
      return requests(ctx);
    if (
      request.status == 0 &&
      ctx.chat.id == ctx.from.id
    )
      return ctx
        .reply(locale.requests.wait_request_process, {
          parse_mode: "HTML",
        })
        .catch((err) => err);
    else if (request.status == 1) return next();
    return;
  } catch (err) {
    console.log(err);
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
