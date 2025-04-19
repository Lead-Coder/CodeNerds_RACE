import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log("Received signup request:", { username, email });
  
      // Validate input
      if (!username || !email || !password) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exists:", email);
        return res.status(400).json({ message: "Email already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
  
      // Ensure JWT secret exists
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing from .env file");
        return res.status(500).json({ message: "Server configuration error" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log("JWT token generated");
  
      // Send response (omit password for security)
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: { _id: newUser._id, username, email },
      });
  
    } catch (error) {
      console.error("Signup error:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔹 Received login request:", { email });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful:", email);

    res.status(200).json({ message: "Login successful", token, user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
