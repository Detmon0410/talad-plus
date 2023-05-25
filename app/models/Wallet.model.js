const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  bank_number: String,
  money: {
    type: Number,
    default: 0,
  },
  bank_name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const UserModel = mongoose.model("Wallet", userSchema);
module.exports = UserModel;
