const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  stall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stall",
  },

  number: Number,
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
});

const UserModel = mongoose.model("SubStall", userSchema);
module.exports = UserModel;
