const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
  },
  image:{
    type: [String],
    required: true
  }
});

const UserModel = mongoose.model("Image", userSchema);

module.exports = UserModel;
