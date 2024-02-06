const { Router } = require("express");
const router = Router();
const express = require("express");
const {
  CheckOut,
  Webhook,
  getHistory,
} = require("../Controllers/orderController");

router.post("/checkout", express.json(), CheckOut);
router.post("/webhook", express.raw({ type: "application/json" }), Webhook);
router.get("/get-history", express.json(), getHistory);

module.exports = router;
