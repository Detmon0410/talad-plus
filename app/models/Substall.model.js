const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  stall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stall",
  },

  number: Number,
  rentedzone: String,
  price: String,
  dateStart: Date,
  dateEnd: Date,
  payment: String,
  status: { type: String, default: "Waiting for payment" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  merchant: String,
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
  },
  market_name: String,
  zone: String,
  transfer_date: String,
  transfer_time: String,
  price: Number,
});

const UserModel = mongoose.model("SubStall", userSchema);
module.exports = UserModel;
