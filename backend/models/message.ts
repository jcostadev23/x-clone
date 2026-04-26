import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fromUserId: { type: String, required: true, index: true },
  fromUserName: { type: String, required: true },
  toUserId: { type: String, required: true, index: true },
  text: { type: String, required: true, maxlength: 1000, trim: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
