const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDataBase = require("./config/db");
require("dotenv").config();
const port = parseInt(process.env.PORT) || 8080;

module.exports = { express, path, cors, connectDataBase, port };
