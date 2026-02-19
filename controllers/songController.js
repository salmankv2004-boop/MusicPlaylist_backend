
import { uploadToCloudinary } from "../Config/cloudinary.js";
import fs from "fs";
import { SongModel } from "../Models/Song.js";


export const UploadSong = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("📁 FILES:", req.files); // Log entire files object

    // Check if files exist
    if (!req.files || !req.files.audio || !req.files.thumbnail) {
      return res.status(400).json({ error: "Both audio and thumbnail are required" });
    }

    const audioFile = req.files.audio[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    const singerFile = req.files.singerImage ? req.files.singerImage[0] : null;

    // Check if title and artist exist
    if (!req.body.title || !req.body.artist) {
      // Delete uploaded files
      if (fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);
      if (thumbnailFile && fs.existsSync(thumbnailFile.path)) fs.unlinkSync(thumbnailFile.path);
      if (singerFile && fs.existsSync(singerFile.path)) fs.unlinkSync(singerFile.path);

      return res.status(400).json({ error: "Title and artist are required" });
    }

    console.log("☁️ Uploading Audio...");
    const audioUrl = await uploadToCloudinary(audioFile.path);

    let thumbnailUrl = "";
    if (thumbnailFile) {
      console.log("☁️ Uploading Thumbnail...");
      thumbnailUrl = await uploadToCloudinary(thumbnailFile.path);
    }

    let singerImageUrl = "";
    if (singerFile) {
      console.log("☁️ Uploading Singer Image...");
      singerImageUrl = await uploadToCloudinary(singerFile.path);
    }

    // cleanup local files
    if (fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);
    if (thumbnailFile && fs.existsSync(thumbnailFile.path)) fs.unlinkSync(thumbnailFile.path);
    if (singerFile && fs.existsSync(singerFile.path)) fs.unlinkSync(singerFile.path);

    // Create song in database
    const song = await SongModel.create({
      title: req.body.title,
      artist: req.body.artist,
      filepath: audioUrl,
      thumbnail: thumbnailUrl,
      singerImage: singerImageUrl,
    });

    console.log("✅ Song created:", song);

    res.status(201).json({
      message: "Song uploaded successfully",
      song,
    });
  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);

    // Clean up if something failed mid-way
    if (req.files?.audio?.[0]?.path && fs.existsSync(req.files.audio[0].path)) {
      fs.unlinkSync(req.files.audio[0].path);
    }
    if (req.files?.thumbnail?.[0]?.path && fs.existsSync(req.files.thumbnail[0].path)) {
      fs.unlinkSync(req.files.thumbnail[0].path);
    }

    res.status(500).json({
      error: error.message || "Upload failed",
    });
  }
};

export const getallsong = async (req, res) => {
  try {
    const songs = await SongModel.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getsongbyid = async (req, res) => {
  try {
    const song = await SongModel.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const deletedSong = await SongModel.findByIdAndDelete(songId);

    if (!deletedSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ message: "Server error" });
  }
};