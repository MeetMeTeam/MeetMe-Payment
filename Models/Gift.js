const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    primaryKey: true,
  },
  giftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gift_list",
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Gift = mongoose.model("Gifts", GiftSchema);

module.exports = Gift;
