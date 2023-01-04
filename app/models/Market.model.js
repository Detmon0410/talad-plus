const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  market_name: String,
  market_detials: String,
  market_address: String,
});

const UserModel = mongoose.model("Market", userSchema);

module.exports = UserModel;
