const Order = require("../Models/Order");
const User = require("../Models/User");
const orderService = require("../services/orderService");

const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const checkoutService = require("../services/checkoutService");

const CheckOut = async (req, res) => {
  const { user, product } = req.body;
  const result = await checkoutService.createPaymentSession(user, product);

  if (result.success) {
    res.status(200).json({
      message: result.message,
      id: result.session_id,
      url: result.url,
    });
  } else {
    res.status(400).json({
      message: result.message,
      error: result.error,
    });
  }
};

const getHistory = async (req, res) => {
  const { userId } = req.query; // Read from query parameters
  const result = await orderService.getHistory(userId);

  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ message: result.message, error: result.error });
  }
};

exports.controllers = {
  CheckOut,
  getHistory,
};
