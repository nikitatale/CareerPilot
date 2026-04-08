import { Router } from "express";
import {
  activeCheck,
  createPost,
  deleteCommentOfUser,
  deletePost,
  getAllPost,
  getCommentsByPosts,
  getPostsByUser,
  getUserPosts,
  incrementLikes,
} from "../controllers/postController.js";
import multer from "multer";
import { commentPost } from "../controllers/userController.js";
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

router.get("/", activeCheck);
router.post("/post", upload.single("media"), createPost);
router.get("/posts", getAllPost);
router.get("/posts/user/:userId", getPostsByUser);
router.delete("/delete_post", deletePost);
router.post("/comment", commentPost);
router.get("/get_comments", getCommentsByPosts);
router.delete("/delete_comment", deleteCommentOfUser);
router.post("/increment_post_like", incrementLikes);
router.get("/user_posts", getUserPosts);

export default router;
