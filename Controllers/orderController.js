const Order = require("../Models/Order");
const User = require("../Models/User");

const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CheckOut = async (req, res) => {
  const { user, product } = req.body;
  try {
    // create payment session
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
    const newOrder = new Order(orderData);
    newOrder
      .save()
      .then((savedOrder) => {
        res.json({
          message: "Checkout success.",
          id: session.id,
          url: session.url,
        });
      })
      .catch((error) => {
        console.error("Error saving order:", error);
        res.status(500).json({
          message: "Error saving order",
          error: error.message,
        });
      });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: "Error payment" });
  }
};

const Webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.END_POINT_SECRET
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentSuccessData = event.data.object;
      const sessionId = paymentSuccessData.id;
      const data = {
        status: paymentSuccessData.status,
        coin: paymentSuccessData.amount_total / 100,
      };

      try {
        // ...
        const result = await Order.updateOne(
          { session_id: sessionId },
          { $set: { status: data.status } }
        );

        const order = await Order.findOne({ session_id: sessionId });
        const userId = order.user_id.toString();
        const user = await User.findOne({ _id: userId });
        console.log("User updated successfully:", user.coin);
        let update = await User.findOneAndUpdate(
          { _id: userId },
          { coin: user.coin + data.coin }
        );
      } catch (error) {
        console.error(error);
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};

const getHistory = async (req, res) => {
  const { userId } = req.body;
  try {
    const order = await Order.find({ user_id: userId });
    if (order.length > 0) {
      res.status(200).json({ data: order });
    } else {
      res.status(400).json({ status: 400, error: "not found" });
    }
  } catch (err) {
    res.status(400).json({ status: 400, error: "Error payment" });
  }
};

module.exports = {
  CheckOut,
  Webhook,
  getHistory,
};
