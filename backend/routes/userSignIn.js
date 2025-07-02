const { express } = require("../dependecies");
const router = express.Router();
const User = require("../models/users");

router.post("/", async (req, res) => {
  try {
    const { userName, passwordHash } = req.body;
    const token = req.body.passwordHash;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    const isUserValid = user.passwordHash === passwordHash;

    if (!isUserValid) {
      return res.status(400).json({
        success: false,
        error: "Credenciais inválidas",
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
