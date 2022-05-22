var lookup = require("binlookup")();
var AsyncCache = require("async-cache");
const { Op } = require("sequelize");
const { Bin } = require("../database");

var cache = new AsyncCache({
  load: lookup,
});

function getBin(bin) {
  return new Promise(async (resolve, reject) => {
    var info = {};
    try {
      var bin_variants = [];
      for (i = 0; i < 4; i++) {
        bin_variants.push(String(bin).slice(0, 6 + i));
      }
      var bin_info = await Bin.findOne({
        where: {
          bin: {
            [Op.in]: bin_variants,
          },
        },
      });
      if (bin_info) {
        info = {
          scheme: bin_info.scheme,
          type: bin_info.type,
          brand: bin_info.brand,
          country: bin_info.country,
          currency: bin_info.currency,
          bank: bin_info.bank,
        };
        return resolve(info);
      }
      cache.get(bin, (err, v) => {
        if (err) return reject(err);
        info = {
          scheme: v.scheme,
          type: v.type,
          brand: v.brand,
          country: v.country.name,
          currency: v.country.currency,
          bank: v.bank.name,
        };
        return resolve(info);
      });
    } catch (err) {
      resolve(info);
    }
  });
}

module.exports = async (bin) => {
  var info = await getBin(bin);
  Object.keys(info).map((v) => {
    try {
      info[v] = info[v].toUpperCase();
    } catch (err) {}
  });
  return info;
};
