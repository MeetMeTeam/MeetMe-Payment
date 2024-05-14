const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const orderRepository = require("../repositories/orderRepository");

const createPaymentSession = async (user, product) => {
  if (!user || !product) {
    return { success: false, message: "need user and product data" };
  }

  try {
    const order = await orderRepository.findUserById(user.userId);
    if (!order) {
      return { success: false, message: "user not found" };
    }

    const orderId = uuidv4();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.URL_WEB}/payment-success/${orderId}`,
      cancel_url: `${process.env.URL_WEB}/payment-cancel/${orderId}`,
    });

    const orderData = {
      user_id: user.userId,
      session_id: session.id,
      status: session.status,
      order_id: orderId,
      url: session.url,
    };

    const savedOrder = await orderRepository.saveOrder(orderData);
    return {
      success: true,
      message: "Checkout success.",
      session_id: session.id,
      url: session.url,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error processing payment",
      error: error.message,
    };
  }
};

module.exports = {
  createPaymentSession,
};
