
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
    console.log("URI:", process.env.MONGO_URI ? "Found" : "Missing");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

testConnection();
