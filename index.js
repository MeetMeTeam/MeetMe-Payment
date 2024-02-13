const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const PaymentRoutes = require("./Routes/Payment");
const WebhookRoutes = require("./Routes/Webhook");

const dotenv = require("dotenv");
const verifyToken = require("./middleware/auth"); // Adjust the path accordingly

dotenv.config();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 8000;

const endpointSecret = process.env.END_POINT_SECRET;

// Middlewares here
app.use(cors());
app.use("/api/payment/webhook", WebhookRoutes);
app.use("/api/payment", verifyToken, PaymentRoutes);

// register the routes

let conn = null;

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Dev-MeetMe",
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`server is listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. server not start");
    console.log(err);
  });

app.get("/", async (req, res) => {
  res.send("hello this is payment api for meet me");
});
