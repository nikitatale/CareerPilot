import { Router } from "express";
import {
  acceptConnectionsRequests,
  downloadProfile,
  getAllUserProfile,
  getMyConnectionRequests,
  getUserAndProfile,
  getUserProfileAndUserBasedOnUsername,
  login,
  logout,
  register,
  sendConnectionRequest,
  updateProfileData,
  updateUserProfile,
  uploadProfilePicture,
  whatAreMyConnections,
  getMyAcceptedConnections,
} from "../controllers/userController.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";

const router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.post("/update_profile_data", updateProfileData);
router.get("/user/get_all_users", getAllUserProfile);
router.get("/user/download_resume", downloadProfile);
router.post("/user/send_connection_request", sendConnectionRequest);
router.get("/user/getConnectionRequests", getMyConnectionRequests);
router.get("/user/user_connection_request", whatAreMyConnections);
router.post("/user/accept_connection_request", acceptConnectionsRequests);
router.get("/user/get_profile_based_on_username", getUserProfileAndUserBasedOnUsername);
router.get("/user/my_accepted_connections", getMyAcceptedConnections);
router.post("/update_profile_picture", upload.single("profile_picture"), uploadProfilePicture);

export default router;
