const Order = require("../Models/Order");
const User = require("../Models/User");

const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CheckOut = async (req, res) => {
  const { user, product } = req.body;
  if (!(user && product)) {
    res.status(400).json({ message: "need user and product data" });
  } else {
    try {
      console.log(user);
      const order = await User.find({ _id: user.userId });
      console.log(order);
      if (order.length > 0) {
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
          res.status(400).json({ message: "Error payment" });
        }
      } else {
        res.status(400).json({ message: "user not found" });
      }
    } catch (err) {
      res.status(400).json({ message: "Error payment : " + err });
    }
  }
};

const getHistory = async (req, res) => {
  const { userId } = req.query; // Change this line to read from query parameters
  if (!userId) {
    res.status(400).json({ message: "need user id" });
  } else {
    try {
      const order = await Order.find({ user_id: userId });
      if (order.length > 0) {
        res.status(200).json({ data: order });
      } else {
        res.status(400).json({ message: "user not found" });
      }
    } catch (err) {
      res.status(400).json({ message: "Error payment : " + err });
    }
  }
};

module.exports = {
  CheckOut,
  getHistory,
};
