import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    comment: { type: String, required: true, maxlength: 280 },
  },
  { _id: false }
);

const tweetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [280, "Tweet cannot exceed 280 characters"],
    trim: true,
  },
  likes: {
    type: [String],
    default: [],
  },
  retweets: {
    type: [String],
    default: [],
  },
  bookmarkedBy: {
    type: [String],
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
