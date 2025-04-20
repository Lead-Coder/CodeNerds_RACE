import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {spawn} from "child_process";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import file from "./routes/file.js"; 
import Latex from "./routes/savelatex.js"; 

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

  app.post("/api/deepseek", (req, res) => {
    const prompt = req.body.prompt?.replace(/[^\x00-\x7F]+/g, "") || "";
  
    const ollama = spawn("ollama", ["run", "deepseek-r1:1.5b"]);
  
    let output = "";
    let flag = false;
  
    // Write the prompt to the stdin of the ollama process
    ollama.stdin.write(prompt + "\n");
  
    // Collect output from the subprocess
    ollama.stdout.on("data", (data) => {
      output += data.toString();
    });
  
    ollama.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
  
    ollama.on("close", (code) => {
      if (code !== 0) {
        console.error(`Ollama process exited with code ${code}`);
        return res.status(500).json({ error: "Failed to process request" });
      }
  
      // Process output like the Python function
      let flag = false;
      let lines = output.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (!flag && lines[i].startsWith("<think>")) {
          output = output.replace(lines[i], "");
          flag = true;
        }
        if (flag) {
          output = output.replace(lines[i], "");
        }
        if (lines[i].startsWith("</think>") && flag) {
          output = output.replace(lines[i], "");
          flag = false;
        }
      }
  
      output = output.trim(); // Remove any leading/trailing whitespace
      console.log(output);
  
      res.json({ response: output });
    });
  
    ollama.stdin.end();
  });

// Use Routes
app.use('/api/auth', auth);
app.use('/api/file', file);  // Add the file upload route
app.use('/api/latex', Latex);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
