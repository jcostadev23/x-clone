const { router } = require("../dependecies");
const Tweet = require("../models/tweet");

router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find();
    res.send({ success: true, data: tweets });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
  try {
    const tweet = req.body.tweet;

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
