import { express } from "../dependecies";
import authenticateToken, { AuthRequest } from "../middleware/auth";
import Message from "../models/message";
import User from "../models/users";

const router = express.Router();

router.get("/conversations", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).sort({ date: -1 });

    const seen = new Set<string>();
    const conversations: any[] = [];

    for (const msg of messages) {
      const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const otherUser = await User.findById(otherId).select("userName");
        const unread = await Message.countDocuments({ fromUserId: otherId, toUserId: userId, read: false });
        conversations.push({
          userId: otherId,
          userName: otherUser?.userName ?? "Unknown",
          lastMessage: msg.text,
          lastMessageDate: msg.date,
          unread,
        });
      }
    }

    res.json({ success: true, data: conversations });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/:userId", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const myId = req.user.userId;
    const { userId: otherId } = req.params;

    const messages = await Message.find({
      $or: [
        { fromUserId: myId, toUserId: otherId },
        { fromUserId: otherId, toUserId: myId },
      ],
    }).sort({ date: 1 });

    await Message.updateMany(
      { fromUserId: otherId, toUserId: myId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, data: messages });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const { toUserId, text } = req.body;

    if (!toUserId || !text?.trim()) {
      return res.status(400).json({ success: false, error: "Recipient and message text are required" });
    }

    if (toUserId === req.user.userId) {
      return res.status(400).json({ success: false, error: "Cannot send message to yourself" });
    }

    const target = await User.findById(toUserId);
    if (!target) {
      return res.status(404).json({ success: false, error: "Recipient not found" });
    }

    const message = await Message.create({
      fromUserId: req.user.userId,
      fromUserName: req.user.userName,
      toUserId,
      text: text.trim(),
    });

    res.status(201).json({ success: true, data: message });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

export default router;
