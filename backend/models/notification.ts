import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "retweet", "follow", "comment"],
    required: true,
  },
  fromUserId: { type: String, required: true },
  fromUserName: { type: String, required: true },
  toUserId: { type: String, required: true, index: true },
  tweetId: { type: String, default: null },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
