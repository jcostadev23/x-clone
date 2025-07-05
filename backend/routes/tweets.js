const { express } = require("../dependecies");
const router = express.Router();
const Tweet = require("../models/tweet");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const tweets = await Tweet.find().sort({ date: -1 }).limit(limit);
    res.send({ success: true, data: tweets });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Token não fornecido" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res
      .status(403)
      .json({ success: false, error: "Token inválido ou expirado" });
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
