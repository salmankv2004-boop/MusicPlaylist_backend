import mongoose from "mongoose";
import { playlistmodel } from '../Models/Playlist.js'
import { UserModel } from '../Models/User.js'
import { SongModel } from "../Models/Song.js";



export const createPlaylist = async (req, res) => {
  try {
    const { title } = req.body;
    const owner = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const playlist = await playlistmodel.create({
      title,
      owner,
      songs: [],
    });

    res.status(201).json({
      message: "Playlist created successfully",
      playlist,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getallPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await playlistmodel.find({ owner: userId });

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getplaylistbyID = async (req, res) => {
  try {
    const { id } = req.params
    const playlist = await playlistmodel.findById(id).populate("songs")

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" })
    }
    res.status(200).json({ message: "get playlist by id", playlist })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" })
  }
}

export const Addsongtoplaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;

    const playlist = await playlistmodel.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const song = await SongModel.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const exists = playlist.songs.some(
      (s) => s.toString() === songId
    );

    if (exists) {
      return res.status(400).json({ message: "Song already added to playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({
      message: "Song added successfully",
      playlist
    });

  } catch (error) {
    console.error("Add song error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const RemovesongfrmPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;
    const playlist = await playlistmodel.findById(id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" })

    playlist.songs = playlist.songs.filter(song => song.toString() !== songId)

    await playlist.save();

    res.status(200).json({ message: "Song removed successfully", playlist })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const DeletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await playlistmodel.findByIdAndDelete(id)
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" })
    }
    res.status(200).json({ message: "Playlist deleted successfully", playlist })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}