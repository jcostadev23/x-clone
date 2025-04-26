const { express } = require("../dependecies");
const router = express.Router();
const User = require("../models/users");

router.post("/", async (req, res) => {
  try {
    const users = await User.find();
    const user = req.body.user;

    const findUser = users.find((u) => u.userName === user.userName);

    if (!findUser) {
      return res.status(400).json({
        success: false,
        error: `${user.userName} You are not register`,
      });
    }

    const userValid = users.find((u) => u.passwordHash === user.passwordHash);

    if (!userValid) {
      return res.status(400).json({
        success: false,
        error: `${user.userName} The password you introduce are not valid`,
      });
    }

    res.status(200).json({ sucess: true, data: userValid });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong on Sign in",
    });
  }
});

module.exports = router;
