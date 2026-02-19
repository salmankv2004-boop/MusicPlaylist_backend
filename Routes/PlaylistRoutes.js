import express from 'express'
import {createPlaylist,
    getallPlaylist,
    getplaylistbyID,
    Addsongtoplaylist,
    RemovesongfrmPlaylist,
    DeletePlaylist } from '../controllers/playlistController.js'
import { verifyToken } from '../controllers/userController.js'


const PlaylistRoute = express.Router()

PlaylistRoute.post("/createPlaylist",verifyToken,createPlaylist)
PlaylistRoute.get("/getallPlaylist",verifyToken,getallPlaylist)
PlaylistRoute.get("/getplaylistbyID/:id",getplaylistbyID)
PlaylistRoute.put("/playlists/:id/add-song/:songId", Addsongtoplaylist)
PlaylistRoute.put("/playlists/:id/remove-song/:songId",RemovesongfrmPlaylist )
PlaylistRoute.delete("/dltplaylists/:id",DeletePlaylist)
export default PlaylistRoute