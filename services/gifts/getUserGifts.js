const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const giftRepository = require("../repositories/giftRepository");

const getUserGifts = async (userId) => {
  try {
    const giftList = await giftRepository.getGiftList();
    const userGifts = await giftRepository.getUserGiftsByUserId(userId);

    const userGiftsMap = new Map();
    userGifts.forEach((gift) => {
      userGiftsMap.set(gift.giftId.toString(), gift.amount);
    });

    const userGiftsWithAmount = giftList.map((gift) => ({
      giftId: gift._id,
      img: gift.img,
      amount: userGiftsMap.has(gift._id.toString())
        ? userGiftsMap.get(gift._id.toString())
        : 0,
    }));

    return { success: true, data: userGiftsWithAmount };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getUserGifts,
};
