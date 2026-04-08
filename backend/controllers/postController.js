import Comment from "../models/commentsModel.js";
import Post from "../models/postsModel.js";
import User from "../models/userModel.js";


export const activeCheck = async(req, res) => {
   console.log("running") 
   return res.status(200).json({message: "Running..."});
}


export const createPost = async(req, res) => {
   try {

   const {token} = req.body;
       
   const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
    })

    await post.save();
    return res.status(200).json({message: "Post Created!"})
      
   } catch (error) {
      return res.status(500).json({message: error.message});
   }
}


export const getAllPost = async(req, res) => {
   try {
      
      const posts = await Post.find().populate("userId", "name username email profilePicture")

      return res.json({posts});

   } catch (error) {
       return res.status(500).json({message: error.message});
   }
}

export const getUserPosts = async (req, res) => {
   try {
      const { userId } = req.query;

      const posts = await Post.find({ userId })
      .populate("userId", "name username profilePicture")
      .sort({ createdAt: -1 });

      return res.json({ posts });

   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}

//DELETE POST
export const deletePost = async(req, res) => {
   try {

   const {token, post_id} = req.body;
       
   const user = await User.findOne({ token })
   .select("_id")


    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const post = await Post.findOne({_id: post_id});

     if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if(post.userId.toString() !== user._id.toString()){
      return res.status(401).json({message: "Unauthorized!"});
    }
    
    await Post.deleteOne({_id: post_id});

    return res.json({message: "Post Deleted!"});

   } catch (error) {
      return res.status(500).json({message: error.message});
   }
}


export const getCommentsByPosts = async(req, res) => {
    try {
        const { post_id } = req.query;

        const post = await Post.findOne({_id: post_id});
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

   
        const comments = await Comment.find({ postId: post_id }).populate("userId", "name username profilePicture");

        return res.json({ comments });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//DELETE COMMENTS OF USERS
export const deleteCommentOfUser = async(req, res) => {
   try {

   const {token, comment_id} = req.body;
        
        
   const user = await User.findOne({ token: token })
   .select("_id")


    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
      

   const comment = await Comment.findOne({"_id": comment_id});
   
   
   if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }


    if(comment.userId.toString() !== user._id.toString()){
      return res.status(401).json({message: "Unauthorized!"});
    }

    await Comment.deleteOne({"_id": comment_id})

    return res.json({message: "Comment Deleted!"});

   } catch (error) {
      return res.status(500).json({message: error.message});
   }
}


// INCREMENTS LIKES
export const incrementLikes = async(req, res) => {
   try {

      const {post_id} = req.body;

      const post = await Post.findOne({_id: post_id});

      if(!post){
         return res.status(404).json({message: "Post not found!"});
      }

      post.likes = post.likes + 1;
      await post.save();

      return res.json({message: "Liked"})

      
   } catch (error) {
      return res.status(500).json({message: error.message});
   }
}


export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 }) 
      .limit(1) 

    return res.json({ posts });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
