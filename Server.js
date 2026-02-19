
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
app.use(cros())
app.use('/', userRoutes, songRoute, playlistroutes)

connectDB()
console.log("ENV CHECK:", {
  mongo: process.env.MONGO_URI,
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
});


app.listen(3000, () => console.log("server start"))