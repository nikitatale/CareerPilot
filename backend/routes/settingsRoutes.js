import express from "express";
import {
  getSettings,
  updateVisibility,
  updateOpenToWork,
  updateNotificationPrefs,
  updateAccount,
  deactivateAccount,
} from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getSettings);

router.patch("/account", protect, updateAccount);

router.patch("/visibility", protect, updateVisibility);

router.patch("/open-to-work", protect, updateOpenToWork);

router.patch("/notifications", protect, updateNotificationPrefs);

router.patch("/deactivate", protect, deactivateAccount);

export default router;