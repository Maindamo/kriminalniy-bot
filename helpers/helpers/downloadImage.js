const { default: axios } = require("axios");

module.exports = function (url) {
  return axios
    .get(String(url), {
      responseType: "arraybuffer",
    })
    .then(
      (response) =>
        "data:image/jpeg;base64," +
        Buffer.from(response.data, "binary").toString("base64")
    );
};
