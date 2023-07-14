const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  market: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Market",
  },
});

const UserModel = mongoose.model("Favorite", userSchema);
module.exports = UserModel;
