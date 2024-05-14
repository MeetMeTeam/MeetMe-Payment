const orderRepository = require("../repositories/orderRepository");

const getHistory = async (userId) => {
  if (!userId) {
    return { success: false, message: "need user id" };
  }

  try {
    const orders = await orderRepository.findOrdersByUserId(userId);
    if (orders.length > 0) {
      return { success: true, data: orders };
    } else {
      return { success: false, message: "user not found" };
    }
  } catch (err) {
    return {
      success: false,
      message: "Error fetching orders",
      error: err.message,
    };
  }
};
module.exports = {
  getHistory,
};
