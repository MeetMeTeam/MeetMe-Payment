const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
  },
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  session_id: {
    type: String,
    required: true,
    unique: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
