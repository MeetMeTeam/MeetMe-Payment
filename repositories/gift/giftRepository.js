const Gift = require("../Models/Gift");
const GiftList = require("../Models/GiftList");
const User = require("../Models/User");

const getAllGifts = async () => {
  try {
    return await GiftList.find({});
  } catch (err) {
    throw new Error(err);
  }
};

const getGiftList = async () => {
  try {
    return await GiftList.find();
  } catch (err) {
    throw new Error(err);
  }
};

const getUserGiftsByUserId = async (userId) => {
  try {
    return await Gift.find({ userId: userId });
  } catch (err) {
    throw new Error(err);
  }
};

const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw new Error(err);
  }
};

const findGiftById = async (giftId) => {
  try {
    return await GiftList.findById(giftId);
  } catch (err) {
    throw new Error(err);
  }
};

const findUserGift = async (userId, giftId) => {
  try {
    return await Gift.findOne({ userId: userId, giftId: giftId });
  } catch (err) {
    throw new Error(err);
  }
};

const saveUser = async (user) => {
  try {
    return await user.save();
  } catch (err) {
    throw new Error(err);
  }
};

const saveGift = async (gift) => {
  try {
    return await gift.save();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getAllGifts,
  getGiftList,
  getUserGiftsByUserId,
  findUserById,
  findGiftById,
  findUserGift,
  saveUser,
  saveGift,
};
