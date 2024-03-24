const { Router } = require("express");
const router = Router();
const express = require("express");
const {
  addGift,
  getAllGifts,
  getUserGifts,
} = require("../Controllers/giftController");

router.post("/add", express.json(), addGift);
router.get("/list", express.json(), getAllGifts);
router.get("/:userId", express.json(), getUserGifts);

module.exports = router;
