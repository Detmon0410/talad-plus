const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  address: String,
  district: String,
  province: String,
  post: String,
  img: String,
  isDonate: { type: Boolean, default: false },
});

const UserModel = mongoose.model("Market", userSchema);

module.exports = UserModel;
