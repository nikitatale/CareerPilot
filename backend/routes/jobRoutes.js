import express from "express";
import {
  searchJobs,
  getJobById,
  toggleSaveJob,
  getSavedJobs,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/search", protect, searchJobs);


router.get("/saved", protect, getSavedJobs);


router.get("/:id", protect, getJobById);


router.patch("/:id/save", protect, toggleSaveJob);

export default router;