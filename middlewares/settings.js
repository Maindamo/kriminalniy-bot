const { Settings } = require("../database");

module.exports = async (ctx, next) => {
  try {
    ctx.state.bot = await Settings.findByPk(1);
    return next();
  } catch (err) {
    console.log(err);
    return ctx.reply("❌ Ошибка").catch((err) => err);
  }
};
