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

module.exports = router;
