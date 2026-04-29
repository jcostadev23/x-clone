import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { express } from "../dependecies";
import authenticateToken from "../middleware/auth";
import User from "../models/users";
import Notification from "../models/notification";

const router = express.Router();

const SAFE_USER_FIELDS = "-passwordHash";

router.get("/", authenticateToken, async (_req: any, res: any) => {
  try {
    const users = await User.find().select(SAFE_USER_FIELDS);
    res.json({ success: true, data: users });
  } catch {
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
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong creating the user" });
  }
});

router.get("/me", authenticateToken, async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      user: { userId: req.user.userId, userName: req.user.userName },
    });
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

router.put("/me/profile", authenticateToken, async (req: any, res: any) => {
  try {
    const { bio, profilePicture, coverPhoto } = req.body;
    const update: Record<string, string> = {};

    if (typeof bio === "string") update.bio = bio.slice(0, 160);
    if (typeof profilePicture === "string") update.profilePicture = profilePicture;
    if (typeof coverPhoto === "string") update.coverPhoto = coverPhoto;

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: update },
      { new: true }
    ).select(SAFE_USER_FIELDS);

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong updating profile" });
  }
});

router.get("/search", authenticateToken, async (req: any, res: any) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) return res.json({ success: true, data: [] });

    const regex = new RegExp(q, "i");
    const users = await User.find({ userName: regex }).select(SAFE_USER_FIELDS).limit(10);
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong searching users" });
  }
});

router.get("/suggestions", authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const currentUser = await User.findById(userId).select("follow");
    if (!currentUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const excludeIds = [...currentUser.follow.map(String), userId];
    const suggestions = await User.find({ _id: { $nin: excludeIds } })
      .select(SAFE_USER_FIELDS)
      .limit(5);

    res.json({ success: true, data: suggestions });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong getting suggestions" });
  }
});

router.get("/:userId", authenticateToken, async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const [user, followersCount, currentUser] = await Promise.all([
      User.findById(userId).select(SAFE_USER_FIELDS),
      User.countDocuments({ follow: userId }),
      User.findById(currentUserId).select("follow"),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isFollowedByCurrentUser = currentUser?.follow.map(String).includes(userId) ?? false;

    res.json({ success: true, data: { ...user.toObject(), followersCount, isFollowedByCurrentUser } });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong getting the user" });
  }
});

router.post("/signout", (_req: any, res: any) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  res.json({ success: true });
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

    await Notification.create({
      type: "follow",
      fromUserId: followerId,
      fromUserName: req.user.userName,
      toUserId: followingId,
    });

    res.json({ success: true, message: "Now you are following the user" });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong following the user" });
  }
});

router.post("/unfollow/:userId", authenticateToken, async (req: any, res: any) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    await User.findByIdAndUpdate(followerId, { $pull: { follow: followingId } });
    res.json({ success: true, message: "Unfollowed successfully" });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong unfollowing the user" });
  }
});

export default router;
