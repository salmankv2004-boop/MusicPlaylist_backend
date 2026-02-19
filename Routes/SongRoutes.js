import express from "express";
import {
  UploadSong,
  getallsong,
  getsongbyid,
  deleteSong,
} from "../controllers/songController.js";

import upload from '../Middleware/multer.js'; // ✅ correct


const Songroute = express.Router();

Songroute.post(
  "/uploadsong",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "singerImage", maxCount: 1 },
  ]),
  UploadSong
);

Songroute.get("/getallsong", getallsong);
Songroute.get("/getbyid/:id", getsongbyid);
Songroute.delete("/delete/:id", deleteSong);

export default Songroute;