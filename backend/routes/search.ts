import { express } from "../dependecies";
import authenticateToken, { AuthRequest } from "../middleware/auth";
import Tweet from "../models/tweet";
import User from "../models/users";
import { formatDate } from "../utils/dateFormater";

const router = express.Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) return res.json({ success: true, tweets: [], users: [] });

    const regex = new RegExp(q, "i");

    const [tweets, users] = await Promise.all([
      Tweet.find({ description: regex }).sort({ date: -1 }).limit(20),
      User.find({ userName: regex }).select("-passwordHash").limit(10),
    ]);

    const formattedTweets = JSON.parse(JSON.stringify(tweets)).map((t: any) => ({
      ...t,
      date: formatDate(t.date),
    }));

    res.json({ success: true, tweets: formattedTweets, users });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

export default router;
