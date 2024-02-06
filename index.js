const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const PaymentRoutes = require("./Routes/Payment");
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

// app.get("/api/order/:id", async (req, res) => {
//   const orderId = req.params.id;
//   try {
//     const [result] = await conn.query(
//       "SELECT * from orders where order_id = ?",
//       orderId
//     );
//     const selectedOrder = result[0];
//     if (!selectedOrder) {
//       throw {
//         errorMessage: "Order not found",
//       };
//     }
//     res.json(selectedOrder);
//   } catch (error) {
//     console.log("error", error);
//     res.status(404).json({ error: error.errorMessage || "System error" });
//   }
// });
