const { Settings } = require("../database");

module.exports = async (
  bot,
  text,
  extra = {
    disable_web_page_preview: true,
  }
) => {
  try {
    const settings = await Settings.findByPk(1);
    return bot
      .sendMessage(settings.loggingGroupId, text, extra)
      .catch((err) => err);
  } catch (err) {}
};
