const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
  },
  name: String,
  startDate: String,
  endDate: String,
  status: String,
});

const UserModel = mongoose.model("Donate", userSchema);
module.exports = UserModel;
