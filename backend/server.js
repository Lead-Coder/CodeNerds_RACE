import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

