import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { express } from "../dependecies";
import User from "../models/users";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ success: false, error: "Credenciais inválidas" });
    }

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({ success: false, error: "Credenciais inválidas" });
    }

    const isHashed = user.passwordHash.startsWith("$2b$") || user.passwordHash.startsWith("$2a$");
    let isValid: boolean;

    if (isHashed) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } else {
      // Legacy plaintext password — verify and rehash on the fly
      isValid = user.passwordHash === password;
      if (isValid) {
        user.passwordHash = await bcrypt.hash(password, 12);
        await user.save();
      }
    }

    if (!isValid) {
      return res.status(400).json({ success: false, error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), userName: user.userName },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2 * 1000,
    });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Something went wrong on sign in" });
  }
});

export default router;
