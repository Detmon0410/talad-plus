const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User.model");
db.market = require("./Market.model");
db.stall = require("./Stall.model");
db.renter = require("./Renter.model");
db.subStall = require("./Substall.model");
db.profile = require("./Profile.model");
db.report = require("./Report.model")

module.exports = db;
