const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  phone: String,
  ownername:String,
  closedDate: [String],
  zone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stall Zone",
    },
  ],
  address: String,
  subdistrict: String,
  district: String,
  province: String,
  post: String,
  img: String,
  imglicense: String,
  detail: String,
  isDonate: { type: Boolean, default: false },
});

const UserModel = mongoose.model("Market", userSchema);

module.exports = UserModel;
