const { Router } = require("express");
const router = Router();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const giftControllers = require("../Controllers/giftController");

router.post("/add", express.json(), giftControllers.controllers.postGift);
router.get("/list", express.json(), giftControllers.controllers.getAllGifts);
router.get(
  "/:userId",
  express.json(),
  giftControllers.controllers.getUserGifts
);

module.exports = router;
