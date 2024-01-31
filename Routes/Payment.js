const { Router } = require("express");
const router = Router();
const express = require("express");
const { CheckOut, Webhook } = require("../Controllers/orderController");

router.post("/checkout", express.json(), CheckOut);
router.post("/webhook", express.raw({ type: "application/json" }), Webhook);

module.exports = router;
