const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  stall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stall",
  },

  number: Number,
  dateStart: String,
  dateEnd: String,
  payment: String,
  Status: { type: Boolean, default: false },
});

const UserModel = mongoose.model("Substall", userSchema);
module.exports = UserModel;
