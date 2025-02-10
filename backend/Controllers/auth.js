const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Parent = require("../Models/Parent");
const Babysitter = require("../Models/Babysitter");
const mongoose = require("mongoose");

async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email); // Debug log

    // Try to find user in both Parent and Babysitter collections
    let user = await Parent.findOne({ email });
    let role = 'parent';

    if (!user) {
      user = await Babysitter.findOne({ email });
      role = 'babysitter';
    }

    if (!user) {
      console.log('No user found with email:', email); // Debug log
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid); // Debug log

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role
    };

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("SignIn Error:", error);
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
}

async function signUp(req, res) {
  try {
    console.log('Signup request body:', req.body); // Debug log

    const {
      name,
      email,
      password,
      age,
      contact,
      adresse,
      photo,
      role,
      tarif,
      experience,
      competances,
      disponibilite,
    } = req.body;

    // Check if user exists in either collection
    const existingParent = await Parent.findOne({ email });
    const existingBabysitter = await Babysitter.findOne({ email });

    if (existingParent || existingBabysitter) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      age: parseInt(age),
      contact,
      adresse,
      photo
    };

    let user;
    if (role.toLowerCase() === 'babysitter') {
      // Add default values for babysitter-specific fields
      user = new Babysitter({
        ...userData,
        tarif: tarif || 0,
        experience: experience || 0,
        competances: competances || [],
        disponibilite: disponibilite || true
      });
    } else {
      user = new Parent(userData);
    }

    console.log('Attempting to save user:', user); // Debug log

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role
    };

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(500).json({
      message: "Error creating account",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

async function logout(req, res) {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
}

module.exports = { signUp, signIn, logout };
