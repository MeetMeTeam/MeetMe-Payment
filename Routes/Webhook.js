const { Router } = require("express");
const router = Router();
const express = require("express");
const Order = require("../Models/Order");
const User = require("../Models/User");
const calFlower = require("../util/calFlower");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/status",
  express.raw({ type: "application/json" }),
  async (req, res) => {
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
          console.log(data.coin);
          let update = await User.findOneAndUpdate(
            { _id: userId },
            { coin: user.coin + calFlower(data.coin) }
          );
        } catch (error) {
          console.error(error);
        }

        break;

      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        console.log(checkoutSessionAsyncPaymentFailed);
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log(checkoutSessionAsyncPaymentSucceeded);
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        console.log(checkoutSessionCompleted);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;
        // Then define and call a function to handle the event checkout.session.expired
        console.log(checkoutSessionExpired);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
  }
);

router.get("/test", async (req, res) => {
  res.send("hello");
});
module.exports = router;
