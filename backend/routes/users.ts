import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { express } from "../dependecies";
import authenticateToken from "../middleware/auth";
import User from "../models/users";

const router = express.Router();

const SAFE_USER_FIELDS = "-passwordHash";

router.get("/", authenticateToken, async (_req: any, res: any) => {
  try {
    const users = await User.find().select(SAFE_USER_FIELDS);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong getting users" });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const { userName, email, password, birthDate } = req.body.user ?? {};

    if (!userName || !email || !password || !birthDate) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ $or: [{ userName }, { email }] });
    if (existing) {
      return res.status(409).json({ success: false, error: "Username or email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, passwordHash, birthDate });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id.toString(), userName: newUser.userName },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" },
    );

    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2 * 1000,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong creating the user" });
  }
});

router.get("/me", authenticateToken, async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      user: { userId: req.user.userId, userName: req.user.userName },
    });
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

router.get("/:userId", authenticateToken, async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(SAFE_USER_FIELDS);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong getting the user" });
  }
});

router.post("/follow/:userId", authenticateToken, async (req: any, res: any) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    if (followerId === followingId) {
      return res.status(400).json({ success: false, error: "You cannot follow yourself" });
    }

    const target = await User.findById(followingId);
    if (!target) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await User.findByIdAndUpdate(followerId, { $addToSet: { follow: followingId } });
    res.json({ success: true, message: "Now you are following the user" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong following the user" });
  }
});

router.post("/unfollow/:userId", authenticateToken, async (req: any, res: any) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    await User.findByIdAndUpdate(followerId, { $pull: { follow: followingId } });
    res.json({ success: true, message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong unfollowing the user" });
  }
});

export default router;
