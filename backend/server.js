const path = require("path");
const express = require("express");
require("dotenv").config();
const port = parseInt(process.env.PORT) || 8080;
const connectDataBase = require("./config/db");
const cors = require("cors");

connectDataBase();

const app = express();
app.use(cors());
// cores({origin: ["http://localhost:5173", "http://localhost:3000"],credentials: true, })

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to X clone API" });
});

const xcloneRouter = require("./routes/xclone");
app.use("/tweets", xcloneRouter);

app.listen(port, () => console.log(`Server listening on port: ${port}`));
