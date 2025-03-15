const express = require("express");
const router = express.Router();
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

module.exports = router;
