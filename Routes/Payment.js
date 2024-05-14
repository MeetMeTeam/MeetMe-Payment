const { Router } = require("express");
const router = Router();
const express = require("express");
const { CheckOut, getHistory } = require("../Controllers/orderController");
const orderControllers = require("../Controllers/orderController");

router.post("/checkout", express.json(), orderControllers.controllers.CheckOut);
router.get(
  "/get-history",
  express.json(),
  orderControllers.controllers.getHistory
);

module.exports = router;
