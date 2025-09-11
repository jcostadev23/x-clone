import express from "express";
import path from "path";
import cors from "cors";
import connectDataBase from "./config/db";

import dotenv from "dotenv";
dotenv.config();

export const port = parseInt(process.env.PORT as string) || 8080;

export { express, path, cors, connectDataBase };
