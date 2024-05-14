const Gift = require("../../Models/Gift");
const GiftList = require("../../Models/GiftList");
const User = require("../../Models/User");

const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const giftRepository = require("../repositories/giftRepository");

const postGift = async (userId, giftId, receiverId, amount) => {
  if (!userId || !giftId || !amount) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const receiver = await giftRepository.findUserById(receiverId);
    const user = await giftRepository.findUserById(userId);
    if (!user || user.coin < amount) {
      return { success: false, message: "Insufficient funds" };
    }

    const gift = await giftRepository.findGiftById(giftId);
    if (!gift) {
      return { success: false, message: "Gift not found" };
    }

    const totalPrice = gift.price * amount;
    if (user.coin < totalPrice) {
      return { success: false, message: "Not enough money" };
    }

    user.coin -= totalPrice;
    await giftRepository.saveUser(user);

    let existingGift = await giftRepository.findUserGift(receiverId, giftId);

    if (existingGift) {
      existingGift.amount += amount;
      await giftRepository.saveGift(existingGift);
      return {
        success: true,
        message: "Gift amount updated successfully",
        data: existingGift,
      };
    } else {
      const newGift = new Gift({
        userId: receiverId,
        giftId: giftId,
        amount: amount,
      });
      await giftRepository.saveGift(newGift);
      return {
        success: true,
        message: "Gift added successfully",
        data: newGift,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: "Error processing the request",
      error: err.message,
    };
  }
};

module.exports = postGift;
