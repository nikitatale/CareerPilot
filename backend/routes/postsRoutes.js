import { Router } from "express";
import { activeCheck, createPost, deleteCommentOfUser, deletePost, getAllPost, getCommentsByPosts, getPostsByUser, getUserPosts, incrementLikes } from "../controllers/postController.js";
import multer from "multer";
import { commentPost } from "../controllers/userController.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage});


router.get("/", activeCheck);


router.route("/post").post(upload.single('media'), createPost);
router.get("/posts", getAllPost);
router.get("/posts/user/:userId", getPostsByUser);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(getCommentsByPosts);
router.route("/delete_comment").delete(deleteCommentOfUser);
router.route("/increment_post_like").post(incrementLikes);
router.get("/user_posts", getUserPosts);

export default router; 