const User = require("../Models/User");
const Order = require("../Models/Order");

const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw new Error(err);
  }
};

const saveOrder = async (orderData) => {
  try {
    const newOrder = new Order(orderData);
    return await newOrder.save();
  } catch (err) {
    throw new Error(err);
  }
};

const findOrdersByUserId = async (userId) => {
  try {
    return await Order.find({ user_id: userId });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  findUserById,
  saveOrder,
  findOrdersByUserId,
};
