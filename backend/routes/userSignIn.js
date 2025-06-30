const { express } = require("../dependecies");
const router = express.Router();
const User = require("../models/users");

router.post("/", async (req, res) => {
  try {
    const { userName, passwordHash } = req.body;
    const token = req.body.passwordHash;

    const users = await User.find();
    const isUserfond = users.find((u) => u.userName === userName);

    if (!isUserfond) {
      return res.status(400).json({
        success: false,
        error: `${userName} You are not register`,
      });
    }

    const isUserValid = users.find((u) => u.passwordHash === passwordHash);

    if (!isUserValid) {
      return res.status(400).json({
        success: false,
        error: `${userName} The password you introduce are not valid`,
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 2, // 2 days,
    });

    res.send({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Something went wrong on Sign in: ${error}`,
    });
  }
});

module.exports = router;
