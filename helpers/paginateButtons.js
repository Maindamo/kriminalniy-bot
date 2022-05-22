const { Markup } = require("telegraf");

module.exports = (pagination, cb_data) => {
  pagination.last = pagination.last || 1;
  var back_cb =
      cb_data +
      String(pagination.current > 1 ? pagination.current - 1 : pagination.last),
    forward_cb =
      cb_data +
      String(pagination.current < pagination.last ? pagination.current + 1 : 1),
    pagination_buttons = [
      Markup.callbackButton(`◀️`, back_cb),
      Markup.callbackButton(`${pagination.current}/${pagination.last}`, "none"),
      Markup.callbackButton("▶️", forward_cb),
    ];

  return pagination_buttons;
};
