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
  birthDate: {
    type: String,
    required: [true, "Please add your Date of birth"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  follow: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
