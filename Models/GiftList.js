const mongoose = require("mongoose");

const GiftListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const GiftList = mongoose.model("gift_list", GiftListSchema);

module.exports = GiftList;
