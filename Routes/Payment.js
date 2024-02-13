const { Router } = require("express");
const router = Router();
const express = require("express");
const { CheckOut, getHistory } = require("../Controllers/orderController");

router.post("/checkout", express.json(), CheckOut);
router.get("/get-history", express.json(), getHistory);

module.exports = router;
