import { UserModel } from "../Models/User.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import connectDB from '../Config/db.js'

const SECRET_KEY = "mysecretkey12"

export const createUser = async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    const user = await UserModel.create(req.body);
    res.status(200).json({ message: "Registration successful!", user });
  } catch (error) {
    console.log("Create User Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Login error: " + err.message });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json("Token missing");

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json("Invalid token");
    req.user = decoded;
    next();
  });
};

export const getProfile = (req, res) => {
  console.log(req.user);

  res.status(200).json({ user: req.user });
};