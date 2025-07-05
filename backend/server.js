require("dotenv").config();
const cookieParser = require("cookie-parser");
const { cors, path, connectDataBase, express, port } = require("./dependecies");

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

const tweetsRouter = require("./routes/tweets");
const usersRouter = require("./routes/users");
const userSignInRouter = require("./routes/userSignIn");

app.use("/tweets", tweetsRouter);
app.use("/users", usersRouter);
app.use("/signin", userSignInRouter);

app.listen(port, () => console.log(`Server listening on port: ${port}`));
