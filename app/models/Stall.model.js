const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
  },

  zone: String,
  startNum: Number,
  endNum: Number,
  price: Number,
  about: String,
});

const UserModel = mongoose.model("Stall", userSchema);
module.exports = UserModel;
