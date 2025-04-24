const { router } = require("../dependecies");
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

    res.status(200).json({ sucess: true, data: newUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong on create the user",
    });
  }
});

module.exports = router;
