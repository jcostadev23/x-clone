const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const connectDataBase = require("./config/db");
require("dotenv").config();
const port = parseInt(process.env.PORT) || 8080;

module.exports = { router, express, path, cors, connectDataBase, port };
