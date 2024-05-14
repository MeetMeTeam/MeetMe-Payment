const Gift = require("../../Models/Gift");
const GiftList = require("../../Models/GiftList");
const User = require("../../Models/User");

const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const giftRepository = require("../repositories/giftRepository");

const getAllGifts = async () => {
  try {
    const gifts = await giftRepository.getAllGifts();
    return { success: true, data: gifts };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllGifts,
};
