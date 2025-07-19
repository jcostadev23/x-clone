import jwt from "jsonwebtoken";
import { express } from "../dependecies";
import User from "../models/users";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { userName, passwordHash } = req.body;

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

    const token = jwt.sign(
      { userId: user._id.toString(), userName: userName },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 2 * 1000,
    });

    res.send({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Something went wrong on Sign in: ${error}`,
    });
  }
});

export default router;
