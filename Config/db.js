import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected");
    } catch (error) {
        console.log("something wrong at connection0", error);
    }


}