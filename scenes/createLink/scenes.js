const Stage = require("telegraf/stage");

const adminSendMail = require("./scenes/admin/sendMail");
const adminEditValue = require("./scenes/admin/editValue");
const adminEditUserPercent = require("./scenes/admin/editUserPercent");
const adminAddProfit = require("./scenes/admin/addProfit");
const adminAddWriter = require("./scenes/admin/addWriter");
const adminAddBin = require("./scenes/admin/addBin");
const adminServiceEditDomain = require("./scenes/admin/serviceEditDomain");

const editPrice = require("./scenes/ads/editPrice");
const sendRequest = require("./scenes/sendRequest");
const sendSms = require("./scenes/sendSms");

const supportSendMessage = require("./scenes/supportSendMessage");

const olxPl = require("./scenes/createLink/olxPl");
const inpostPl = require("./scenes/createLink/inpostPl");
const dpdPl = require("./scenes/createLink/dpdPl");
const pocztaPolskaPl = require("./scenes/createLink/pocztaPolskaPl");
const royalmailUk = require("./scenes/createLink/royalmailUk");
const gumtreeUk = require("./scenes/createLink/gumtreeUk");
const olxPt = require("./scenes/createLink/olxPt");
const dbaDk = require("./scenes/createLink/dbaDk");
const guloggratisDk = require("./scenes/createLink/guloggratisDk");
const glsDk = require("./scenes/createLink/glsDk");
const wallapopEs = require("./scenes/createLink/wallapopEs");
const tablondeanunciosEs = require("./scenes/createLink/tablondeanunciosEs");
const milanunciosEs = require("./scenes/createLink/milanunciosEs");
const olxUa = require("./scenes/createLink/olxUa");
const novaposhtaUa = require("./scenes/createLink/novaposhtaUa");
const olxRo = require("./scenes/createLink/olxRo");
const postnordSe = require("./scenes/createLink/postnordSe");
const blocketSe = require("./scenes/createLink/blocketSe");
const postaHr = require("./scenes/createLink/postaHr");
const leboncoinFr = require("./scenes/createLink/leboncoinFr");
const econtBg = require("./scenes/createLink/econtBg");
const olxBg = require("./scenes/createLink/olxBg");
const lalafoRs = require("./scenes/createLink/lalafoRs");
const kupujemprodajemRs = require("./scenes/createLink/kupujemprodajemRs");
const subitoIt = require("./scenes/createLink/subitoIt");
const dehandsBe = require("./scenes/createLink/2dehandsBe");

const auspostAu = require("./scenes/createLink/auspostAu");

const stage = new Stage([
  olxPl,
  inpostPl,
  dpdPl,
  pocztaPolskaPl,

  olxPt,

  royalmailUk,
  gumtreeUk,

  glsDk,
  dbaDk,
  guloggratisDk,

  wallapopEs,
  tablondeanunciosEs,
  milanunciosEs,

  olxUa,
  novaposhtaUa,

  sendRequest,
  sendSms,
  editPrice,
  supportSendMessage,

  olxRo,
  postnordSe,
  blocketSe,
  postaHr,
  leboncoinFr,
  econtBg,

  olxBg,

  lalafoRs,
  kupujemprodajemRs,

  subitoIt,
  dehandsBe,

  auspostAu,

  adminSendMail,
  adminEditValue,
  adminEditUserPercent,
  adminAddProfit,
  adminAddWriter,
  adminAddBin,
  adminServiceEditDomain,
]);

stage.action("cancel", (ctx) => ctx.scene.leave());

module.exports = stage;
