const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  bank_number: String,
  money: Number,
  date: String,
  time: String,
  status: {type: String, default: "กำลังดำเนินการ"} , 
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const UserModel = mongoose.model("Withdraw", userSchema);
module.exports = UserModel;
