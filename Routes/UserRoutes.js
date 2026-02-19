import express from 'express'
import { createUser,  loginUser, verifyToken , getProfile } from '../controllers/userController.js'
const Userroute = express.Router()

Userroute.post("/createUser",createUser)
Userroute.post("/loginUser", loginUser)
Userroute.get("/getProfile",verifyToken , getProfile)
export default Userroute