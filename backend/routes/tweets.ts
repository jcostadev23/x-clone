import { express } from "../dependecies";
import authenticateToken, { AuthRequest } from "../middleware/auth";
import Tweet from "../models/tweet";
import User from "../models/users";
import Notification from "../models/notification";
import { formatDate } from "../utils/dateFormater";

const router = express.Router();

const formatTweet = (tweet: any) => ({ ...tweet, date: formatDate(tweet.date) });

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
    const finalTweets = tweetsDeepCopy.map(formatTweet);

    res.json({ success: true, data: finalTweets });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/bookmarks", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const tweets = await Tweet.find({ bookmarkedBy: userId }).sort({ date: -1 });
    const formatted = JSON.parse(JSON.stringify(tweets)).map(formatTweet);
    res.json({ success: true, data: formatted });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/user/:userId", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const { userId } = req.params;
    const tweets = await Tweet.find({ userId }).sort({ date: -1 });
    const formatted = JSON.parse(JSON.stringify(tweets)).map(formatTweet);
    res.json({ success: true, data: formatted });
  } catch {
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
      retweets: [],
      bookmarkedBy: [],
      comments: [],
    });

    await newTweet.save();
    res.status(201).json({ success: true, data: newTweet });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.delete("/:id", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ success: false, error: "Tweet not found" });
    }

    if (tweet.userId !== userId) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this tweet" });
    }

    await tweet.deleteOne();
    res.json({ success: true, message: "Tweet deleted" });
  } catch {
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
      if (tweet.userId !== userId) {
        await Notification.create({
          type: "like",
          fromUserId: userId,
          fromUserName: req.user.userName,
          toUserId: tweet.userId,
          tweetId: tweetId,
        });
      }
    }

    await tweet.save();
    res.json({ success: true, data: tweet });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/:id/retweet", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ success: false, error: "Tweet not found" });
    }

    const retweeted = tweet.retweets.includes(userId);

    if (retweeted) {
      tweet.retweets = tweet.retweets.filter((id: string) => id !== userId);
    } else {
      tweet.retweets.push(userId);
      if (tweet.userId !== userId) {
        await Notification.create({
          type: "retweet",
          fromUserId: userId,
          fromUserName: req.user.userName,
          toUserId: tweet.userId,
          tweetId: tweetId,
        });
      }
    }

    await tweet.save();
    res.json({ success: true, data: tweet });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/:id/bookmark", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ success: false, error: "Tweet not found" });
    }

    const bookmarked = tweet.bookmarkedBy.includes(userId);

    if (bookmarked) {
      tweet.bookmarkedBy = tweet.bookmarkedBy.filter((id: string) => id !== userId);
    } else {
      tweet.bookmarkedBy.push(userId);
    }

    await tweet.save();
    res.json({ success: true, data: tweet, bookmarked: !bookmarked });
  } catch {
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

    if (tweet.userId !== req.user.userId) {
      await Notification.create({
        type: "comment",
        fromUserId: req.user.userId,
        fromUserName: req.user.userName,
        toUserId: tweet.userId,
        tweetId: tweetId,
      });
    }

    await tweet.save();
    res.json({ success: true, data: tweet });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

export default router;
