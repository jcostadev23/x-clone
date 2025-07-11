const { express } = require("../dependecies");
const router = express.Router();
const Tweet = require("../models/tweet");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { formatDate } = require("../utils/dateFormater");

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ sucess: false, error: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

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

router.post("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, error: "Token not found" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res
      .status(403)
      .json({ success: false, error: "Token invalid or expired" });
  }

  try {
    const tweet = {
      ...req.body.tweet,
      userId: decoded.userId,
      userName: decoded.userName,
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
