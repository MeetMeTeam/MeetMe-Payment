const postGift = require("../services/postGift");
const giftService = require("../services/giftService");
const giftService = require("../services/giftService");
const giftService = require("../services/giftService");

const postGift = async (req, res) => {
  const { userId, giftId, receiverId, amount } = req.body;
  const result = await giftService.postGift(userId, giftId, receiverId, amount);

  if (result.success) {
    res.status(200).json({ message: result.message, data: result.data });
  } else {
    res.status(400).json({ message: result.message, error: result.error });
  }
};

const getUserGifts = async (req, res) => {
  const userId = req.params.userId;
  const result = await giftService.getUserGifts(userId);

  if (result.success) {
    res.status(200).json({
      message: "Successfully fetched user's gifts",
      data: result.data,
    });
  } else {
    res.status(400).json({
      message: "Error fetching user's gifts",
      error: result.error,
    });
  }
};

const getAllGifts = async (req, res) => {
  const result = await giftService.getAllGifts();

  if (result.success) {
    res
      .status(200)
      .json({ message: "Successfully fetched all gifts", data: result.data });
  } else {
    res
      .status(400)
      .json({ message: "Error fetching gifts", error: result.error });
  }
};

exports.controllers = {
  postGift,
  getAllGifts,
  getUserGifts,
};
