const { express } = require("../dependecies");
const router = express.Router();
const User = require("../models/users");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send({ success: true, data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong on geting the Users",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body.user;

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User are required" });
    }

    const newUser = new User(user);
    await newUser.save();

    const token = newUser._id.toString();

    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 2 * 1000,
    });

    res.status(200).json({ sucess: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong on create the user",
    });
  }
});

module.exports = router;
