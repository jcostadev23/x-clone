import { express } from "../dependecies";
import authenticateToken, { AuthRequest } from "../middleware/auth";
import Tweet from "../models/tweet";
import User from "../models/users";
import { formatDate } from "../utils/dateFormater";

const router = express.Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const following = currentUser.follow;
    const limit = parseInt(req.query.limit as string) || 7;

    const [followTweets, otherTweets] = await Promise.all([
      Tweet.find({ userId: { $in: following } }).sort({ date: -1 }).limit(5),
      Tweet.find({ userId: { $nin: [...following, userId] } }).sort({ date: -1 }).limit(limit),
    ]);

    const tweetsDeepCopy = JSON.parse(JSON.stringify([...followTweets, ...otherTweets]));
    const finalTweets = tweetsDeepCopy.map((tweet: any) => ({
      ...tweet,
      date: formatDate(tweet.date),
    }));

    res.json({ success: true, data: finalTweets });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const { description } = req.body.tweet ?? {};

    if (!description?.trim()) {
      return res.status(400).json({ success: false, error: "Tweet description is required" });
    }

    const newTweet = new Tweet({
      description: description.trim(),
      userId: req.user.userId,
      userName: req.user.userName,
      likes: [],
      comments: [],
    });

    await newTweet.save();
    res.status(201).json({ success: true, data: newTweet });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/:id", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ success: false, error: "Tweet not found" });
    }

    const liked = tweet.likes.includes(userId);

    if (liked) {
      tweet.likes = tweet.likes.filter((id: string) => id !== userId);
    } else {
      tweet.likes.push(userId);
    }

    await tweet.save();
    res.json({ success: true, data: tweet });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/:id/comment", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const { comment } = req.body;
    const tweetId = req.params.id;

    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({ success: false, error: "Comment text is required" });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ success: false, error: "Tweet not found" });
    }

    tweet.comments.push({ id: req.user.userId, comment: comment.trim() });
    await tweet.save();

    res.json({ success: true, data: tweet });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

export default router;
