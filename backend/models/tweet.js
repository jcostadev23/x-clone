const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: [false],
  },
  userName: {
    type: String,
    required: [false],
  },
  description: {
    type: String,
    required: [true, "Please add a name"],
  },
  likes: {
    type: Array,
    required: [false],
  },
  comments: {
    type: Array,
    required: [false],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
