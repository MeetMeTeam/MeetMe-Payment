const Gift = require("../Models/Gift");
const GiftList = require("../Models/GiftList");
const User = require("../Models/User");

const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const addGift = async (req, res) => {
  const { userId, giftId, receiverId, amount } = req.body;
  if (!userId || !giftId || !amount) {
    return res
      .status(400)
      .json({ message: "Missing required fields in the request body" });
  }

  try {
    const receiver = await User.findById(receiverId);
    const user = await User.findById(userId);
    if (!user || user.coin < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const gift = await GiftList.findById(giftId);
    if (!gift) {
      return res.status(400).json({ message: "Gift not found" });
    }

    const totalPrice = gift.price * amount;
    if (user.coin < totalPrice) {
      return res.status(400).json({ message: "Not enough money" });
    }

    user.coin -= totalPrice;
    await user.save();

    let existingGift = await Gift.findOne({
      userId: receiver,
      giftId: giftId,
    });

    console.log(existingGift);
    if (existingGift) {
      existingGift.amount += amount;
      await existingGift.save();
      return res.status(200).json({
        message: "Gift amount updated successfully",
        data: existingGift,
      });
    } else {
      const newGift = new Gift({
        userId: receiver,
        giftId: giftId,
        amount: amount,
      });
      console.log(newGift);
      await newGift.save();

      return res
        .status(200)
        .json({ message: "Gift added successfully", data: newGift });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error processing the request", error: err });
  }
};

const getAllGifts = async (req, res) => {
  try {
    const gifts = await GiftList.find({});
    res
      .status(200)
      .json({ message: "Successfully fetched all gifts", data: gifts });
  } catch (err) {
    res.status(400).json({ message: "Error fetching gifts", error: err });
  }
};

const getUserGifts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const giftList = await GiftList.find();

    const userGifts = await Gift.find({ userId: userId });

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

    res.status(200).json({
      message: "Successfully fetched user's gifts",
      data: userGiftsWithAmount,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error fetching user's gifts", error: err });
  }
};
module.exports = {
  addGift,
  getAllGifts,
  getUserGifts,
};
