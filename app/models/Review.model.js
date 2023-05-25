const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
  },
  description: String,
  star: Number,
  time: String,
});

const UserModel = mongoose.model("Review", userSchema);

module.exports = UserModel;
