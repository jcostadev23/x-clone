import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { connectDataBase, cors, express, path, port } from "./dependecies";
import tweetsRouter from "./routes/tweets";
import usersRouter from "./routes/users";
import userSignInRouter from "./routes/userSignIn";

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to X clone API" });
});

app.use("/tweets", tweetsRouter);
app.use("/users", usersRouter);
app.use("/signin", userSignInRouter);

app.listen(port, () => console.log(`Server listening on port: ${port}`));
