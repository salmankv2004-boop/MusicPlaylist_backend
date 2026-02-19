import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true

    },
    artist: {
      type: String,
      required: true
    },
    filepath: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: false, // Make it optional for now to support old songs
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false
    },
  },
  { timestamps: true }

)
export const SongModel = mongoose.models.song || mongoose.model("song", songSchema);
