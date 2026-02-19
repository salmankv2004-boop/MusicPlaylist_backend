import mongoose  from "mongoose";

const userschema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }

        },

      { timestamps: true }
)

export const UserModel = mongoose.model("user",userschema)