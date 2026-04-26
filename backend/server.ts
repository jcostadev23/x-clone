import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDataBase, cors, express, path, port } from "./dependecies";
import tweetsRouter from "./routes/tweets";
import usersRouter from "./routes/users";
import userSignInRouter from "./routes/userSignIn";
import notificationsRouter from "./routes/notifications";
import messagesRouter from "./routes/messages";
import searchRouter from "./routes/search";

connectDataBase();

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to X clone API" });
});

app.use("/tweets", generalLimiter, tweetsRouter);
app.use("/users", generalLimiter, usersRouter);
app.use("/signin", authLimiter, userSignInRouter);
app.use("/notifications", generalLimiter, notificationsRouter);
app.use("/messages", generalLimiter, messagesRouter);
app.use("/search", generalLimiter, searchRouter);

app.listen(port, () => console.log(`Server listening on port: ${port}`));
