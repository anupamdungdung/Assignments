import express from "express";
import User from "../models/userSchema.js";
import { streamVideo } from "../controllers/stream.js";
import {
  uploadPicture,
  uploadVideo,
} from "../configurations/configurations.js";

const router = express.Router();

router.get("/", async (req, res) => {
  //   try {
  //     //Get all the current users in the database
  //     const Users = await User.find(); //This is an asynchronous action

  //     res.status(200).json(Users);
  //   } catch (error) {
  //     res.status(404).json({ message: error.message });
  //   }
  res.send("This is the profile page");
});

router.post(
  "/image",
  uploadPicture.single("profileImage"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post(
  "/images",
  uploadPicture.array("multipleImages", 3),
  (req, res) => {
    res.send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post(
  "/video",
  uploadVideo.single("video"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/stream", streamVideo);

export default router;


