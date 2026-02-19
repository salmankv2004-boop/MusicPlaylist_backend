
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import userRoutes from "./Routes/UserRoutes.js"

import connectDB from "./Config/db.js"
import songRoute from "./routes/songRoutes.js"
import playlistroutes from "./routes/playlistRoutes.js"
import cros from "cors"




const app = express()
app.use(express.json())
// Manual CORS handling for preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if ([
    "https://music-playlist-frontend-six.vercel.app",
    "http://localhost:5173"
  ].includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

const corsOptions = {
  origin: [
    "https://music-playlist-frontend-six.vercel.app",
    "http://localhost:5173", // For local development
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cros(corsOptions));


app.use('/', userRoutes, songRoute, playlistroutes)

connectDB()
console.log("ENV CHECK:", {
  mongo: process.env.MONGO_URI,
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
});


app.listen(3000, () => console.log("server start"))