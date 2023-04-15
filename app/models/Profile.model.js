const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  address: String,
  district: String,
  province: String,
  aboutme: String,
  img: String,
  rating: Number,
  phone: String,
});

const UserModel = mongoose.model("Profile", userSchema);

module.exports = UserModel;
