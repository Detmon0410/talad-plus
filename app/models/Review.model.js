const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  stall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stall",
  },
  topic: String,
  description: String,
});

const UserModel = mongoose.model("Review", userSchema);

module.exports = UserModel;
