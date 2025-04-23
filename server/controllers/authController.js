const bcrypt = require("bcrypt");
const User=require("../model/userModel");

// Signup (already there)
const signupUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log(name, password);
    if (!name || !password) {
      return res.status(400).json({ success: false, message: "Please provide username and password" });
    }
    const existingUser = await User.findOne({ username:name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username:name,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User signed up successfully!" });
  } catch (error) {
    // console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 🔐 Login controller
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ success: false, message: "Please provide username and password" });
    }
    const user = await User.findOne({ username:name });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { signupUser, loginUser };
