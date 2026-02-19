
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
const corsOptions = {
  origin: [
    "https://music-playlist-frontend-six.vercel.app",
    "http://localhost:5173", // For local development
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cros(corsOptions));
app.options("*", cros(corsOptions)); // Handle preflight requests explicitly for all routes

app.use('/', userRoutes, songRoute, playlistroutes)

connectDB()
console.log("ENV CHECK:", {
  mongo: process.env.MONGO_URI,
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
});


app.listen(3000, () => console.log("server start"))