const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
  },
  passwordHash: {
    type: String,
    required: [true, "Please add a password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
