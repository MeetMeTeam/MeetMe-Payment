const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  displayName: String,
  birthday: String,
  email: String,
  password: String,
  image: String,
  username: String,
  coin: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
