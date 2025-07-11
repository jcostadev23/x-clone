const { express } = require("../dependecies");
const router = express.Router();
const Tweet = require("../models/tweet");
const User = require("../models/users");
const { formatDate } = require("../utils/dateFormater");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ sucess: false, error: "User not found" });
    }

    const following = currentUser.follow;
    const limit = parseInt(req.query.limit) || 7;

    const followTweets = await Tweet.find({ userId: { $in: following } })
      .sort({ date: -1 })
      .limit(5);

    const tweetsIds = followTweets.map((tweet) => tweet._id);
    const tweets = await Tweet.find({ _id: { $nin: tweetsIds } })
      .sort({ date: -1 })
      .limit(limit);

    const tweetsDeepCopy = JSON.parse(
      JSON.stringify([...followTweets, ...tweets])
    );
    const finalTweets = tweetsDeepCopy.map((tweet) => ({
      ...tweet,
      date: formatDate(tweet.date),
    }));

    res.send({ success: true, data: finalTweets });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const tweet = {
      ...req.body.tweet,
      userId: req.user.userId,
      userName: req.user.userName,
    };

    if (!tweet) {
      return res
        .status(400)
        .json({ success: false, error: "Tweet are required" });
    }

    const newTweet = new Tweet(tweet);
    await newTweet.save();

    res.status(200).json({ sucess: true, data: newTweet });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ sucess: false, error: "Tweet not found" });
    }

    const liked = tweet.likes.includes(userId);

    if (liked) {
      tweet.likes = tweet.likes.filter((id) => id !== userId);
    } else {
      tweet.likes.push(userId);
    }

    await tweet.save();
    res.status(200).json({ sucess: true, data: tweet });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.put("/:id/comment", async (req, res) => {
  try {
    const { comment } = req.body;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ sucess: false, error: "Tweet not found" });
    }

    tweet.comments.push(comment);
    await tweet.save();

    res.status(200).json({ sucess: true, data: tweet });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
