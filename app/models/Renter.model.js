const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
  },
  datefrom: Date,
  dateto: Date,
  zone: String,
  startNum: Number,
  endNum: Number,
  price: Number,
  about: String,
});

const UserModel = mongoose.model("Renter", userSchema);

module.exports = UserModel;
