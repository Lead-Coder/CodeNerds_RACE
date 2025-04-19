import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import file from "./routes/file.js"; // Import your file handling routes

dotenv.config();

const app = express();

// Enable CORS for React frontend
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/auth', auth);
app.use('/api/file', file);  // Add the file upload route

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
