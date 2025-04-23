const User = require("../models/authSchema");
const jwt = require("jsonwebtoken");

const DEFAULT_PROFILE_PIC = "https://res.cloudinary.com/dyliomioh/image/upload/v1745416886/avatar_oscmdp.png";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // If user uploads a picture, use it. Otherwise, use default.
    const profilePicture = req.file ? req.file.path : DEFAULT_PROFILE_PIC;

    const newUser = new User({
      username,
      email,
      password,
      profilePicture,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // identifier = email or username

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: email }]
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT tokens
    const payload = { id: user._id };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Set access token and refresh token as HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // Create a new access token
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

      // Send the new access token as an HTTP-only cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.status(200).json({ message: "Access token refreshed successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to refresh access token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
