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
    const hidden = currentUser.hiddenPosts ?? [];
    const limit = parseInt(req.query.limit as string) || 7;
    const feedType = req.query.feed as string;

    let tweets: any[];

    if (feedType === "following") {
      tweets = await Tweet.find({
        userId: { $in: following },
        _id: { $nin: hidden },
      }).sort({ date: -1 }).limit(limit);
    } else {
      const [followTweets, otherTweets] = await Promise.all([
        Tweet.find({ userId: { $in: following }, _id: { $nin: hidden } }).sort({ date: -1 }).limit(5),
        Tweet.find({ userId: { $nin: [...following, userId] }, _id: { $nin: hidden } }).sort({ date: -1 }).limit(limit),
      ]);
      tweets = [...followTweets, ...otherTweets];
    }

    const finalTweets = JSON.parse(JSON.stringify(tweets)).map(formatTweet);
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

router.get("/:id", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ success: false, error: "Tweet not found" });
    }

    // Resolve liker names from user IDs
    const likerNames = tweet.likes.length
      ? (await User.find({ _id: { $in: tweet.likes } }).select("userName")).map((u: any) => u.userName)
      : [];

    // Back-fill userName for comments that were stored before the schema change
    const missingIds = tweet.comments
      .filter((c: any) => !c.userName)
      .map((c: any) => c.id);

    const userMap: Record<string, string> = {};
    if (missingIds.length) {
      const users = await User.find({ _id: { $in: missingIds } }).select("_id userName");
      users.forEach((u: any) => { userMap[u._id.toString()] = u.userName; });
    }

    const tweetObj = JSON.parse(JSON.stringify(tweet));
    const commentsWithNames = tweetObj.comments.map((c: any) => ({
      ...c,
      userName: c.userName || userMap[c.id] || c.id,
    }));

    const formatted = formatTweet({ ...tweetObj, comments: commentsWithNames });
    res.json({ success: true, data: { ...formatted, likerNames } });
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

    tweet.comments.push({ id: req.user.userId, userName: req.user.userName, comment: comment.trim() });

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

router.put("/:id/not-interested", authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user.userId;
    const tweetId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const alreadyHidden = user.hiddenPosts.map(String).includes(tweetId);

    if (alreadyHidden) {
      user.hiddenPosts = user.hiddenPosts.filter((id: any) => id.toString() !== tweetId);
    } else {
      user.hiddenPosts.push(tweetId as any);
    }

    await user.save();
    res.json({ success: true, hidden: !alreadyHidden });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

export default router;
