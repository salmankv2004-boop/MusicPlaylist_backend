import mongoose from "mongoose";


const playlistschema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        songs: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],
            default: []
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId, ref: "user",

        }

    },
    { timestamps: true }
)
export const playlistmodel = mongoose.model("playlist", playlistschema)