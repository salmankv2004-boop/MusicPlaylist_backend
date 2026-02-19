import { UserModel } from "../Models/User.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import connectDB from '../Config/db.js'

const SECRET_KEY = "mysecretkey12"

export const createUser = async (req, res) => {
  try {
    await connectDB(); // Ensure DB is connected
    console.log("created", req.body);
    // find email
    // if exist 
    const user = await UserModel.create(req.body)
    console.log(user);

    res.status(200).json({ message: "created successfully", user })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" })

  }
}

export const loginUser = async (req, res) => {
  try {
    await connectDB(); // Ensure DB is connected
    const { email } = req.body;



    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name: email.split("@")[0],
        email,
        password: ""   // IMPORTANT
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    console.log(err);
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