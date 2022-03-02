import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
  sendRequest,
  deleteRequest,
  acceptRequest,
  rejectRequest,
} from "../controllers/user.js";

const router = express.Router();

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.put("/:id/sendRequest", sendRequest);
router.put("/:id/deleteRequest", deleteRequest);
router.put("/:id/acceptRequest", acceptRequest);
router.put("/:id/rejectRequest", rejectRequest);

export default router;
