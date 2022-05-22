const { Writer, Country, Ad, User, Settings, Profit } = require("../database");

module.exports = async function (
  ctx,
  action,
  extra = {
    disable_web_page_preview: true,
  }
) {
  const settings = await Settings.findByPk(1);
  return ctx.telegram
    .sendMessage(
      settings.loggingGroupId,
      `Пользователь <b><a href="tg://user?id=${ctx.from.id}">${ctx.from.username}</a></b> <code>(ID: ${ctx.from.id})</code>: ${action}`,
      {
        parse_mode: "HTML",
        ...extra,
      }
    )
    .catch((err) => err);
};
