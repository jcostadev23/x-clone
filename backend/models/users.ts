import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    lowercase: true,
    trim: true,
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

usersSchema.index({ userName: 1 }, { unique: true });
usersSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", usersSchema);

export default User;
