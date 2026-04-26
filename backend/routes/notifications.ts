import { express } from "../dependecies";
import authenticateToken, { AuthRequest } from "../middleware/auth";
import Notification from "../models/notification";

const router = express.Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const notifications = await Notification.find({ toUserId: req.user.userId })
      .sort({ date: -1 })
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/read", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    await Notification.updateMany(
      { toUserId: req.user.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/unread-count", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const count = await Notification.countDocuments({ toUserId: req.user.userId, read: false });
    res.json({ success: true, count });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

export default router;
