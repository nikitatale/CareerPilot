import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import connectionRequest from "../models/connectionsModel.js";
import Comment from "../models/commentsModel.js";
import Post from "../models/postsModel.js";


const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

doc.image(`uploads/${userData.userId.profilePicture}`, {align: "center", width: 100})
doc.fontSize(14).text(`Name: ${userData.userId.name}`);
doc.fontSize(14).text(`Username: ${userData.userId.username}`);
doc.fontSize(14).text(`Email: ${userData.userId.email}`);
doc.fontSize(14).text(`Bio: ${userData.bio || "Not provided"}`);
doc.fontSize(14).text(`Current Position: ${userData.currentPost || "Not provided"}`);

if(userData.pastWork && userData.pastWork.length > 0){
  doc.fontSize(14).text(`Past Work:`);
  userData.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company Name: ${work.company || "N/A"}`);
    doc.fontSize(14).text(`Position: ${work.position || "N/A"}`);
    doc.fontSize(14).text(`Years: ${work.years || "N/A"}`);
  });
}else{
  doc.fontSize(14).text(`Past Work: None`);
}

if(userData.education && userData.education.length > 0){
  doc.fontSize(14).text(`Education:`);
  userData.education.forEach((edu) => {
    doc.fontSize(14).text(`School: ${edu.school || "N/A"}`);
    doc.fontSize(14).text(`Degree: ${edu.degree || "N/A"}`);
    doc.fontSize(14).text(`Field Of Study: ${edu.fieldOfStudy || "N/A"}`);
  });
}else{
  doc.fontSize(14).text(`Education: None`);
}
  


  doc.end();

  return outputPath;

}

// REGISTER
export const register = async (req, res) => {
  try {

    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id
    });

    await profile.save();

    return res.json({ message: "User created successfully!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// LOGIN
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.token = token;

    await user.save();

    return res.json({
      message: "Login successful!",
      token
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// UPLOAD PROFILE PICTURE
export const uploadProfilePicture = async (req, res) => {
  try {

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token required!" });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image not uploaded!" });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    return res.json({
      message: "Profile picture updated!",
      image: req.file.filename
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// UPDATE USER PROFILE 
export const updateUserProfile = async(req, res) => {
  try {

   const {token, ...newUserData} = req.body;
     
   const user = await User.findOne({token: token});

    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const {username, email} = newUserData;

    const existingUser = await User.findOne({$or: [{username}, {email}]});

    if(existingUser){
      if(existingUser || String(existingUser._id) !== String(user._id)){
        return res.status(400).json({ message: "User already exists!" });
      }
    }


    Object.assign(user, newUserData);
    await user.save();

    return res.json({message: "User Updated!"});

    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// GET USER & PROFILE 
export const getUserAndProfile = async(req, res) => {
   try {

    const { token } = req.query;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }



    const userProfile = await Profile.findOne({userId: user._id})
    .populate("userId", "name email username profilePicture");

    return res.json(userProfile);



    
   } catch (error) {
    return res.status(500).json({ message: error.message });
   }
}


// UPDATE PROFILE DATA
export const updateProfileData = async(req, res) => {
  try {
    
   const {token, ...newProfileData} = req.body;
     
   const userProfile = await User.findOne({token: token});

    
    if (!userProfile) {
      return res.status(404).json({ message: "User not found!" });
    }

    const profile_to_update = await Profile.findOne({userId: userProfile._id})

    Object.assign(profile_to_update, newProfileData);
 
    await profile_to_update.save();

    return res.json({message: "Profile Updated!"});
     

  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
}


// GET ALL USER PROFILE 
export const getAllUserProfile = async(req, res) => {
   try {

    const profiles = await Profile.find().populate("userId", "name username email profilePicture");

    return res.json({profiles});

    
   } catch (error) {
    return res.status(500).json({ message: error.message });
   }
}


// DOWNLOAD PROFILE
export const downloadProfile = async(req, res) => {
  try {
    
    const user_id = req.query.id;
   
    const userProfile = await Profile.findOne({userId: user_id})
    .populate("userId", "name username email profilePicture");

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({"message": outputPath});

  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
}


//SEND CONNECTION REQUEST
export const sendConnectionRequest = async(req, res) => {
  try {

    const {token, connectionId} = req.body;

     const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connectionUser = await User.findOne({_id: connectionId});

    if(!connectionUser){
      return res.status(404).json({message: "Connection User not found!"});
    }

    const existingRequest = await connectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id
    })

    if(existingRequest){
      return res.status(400).json({message: "Request already sent"})
    }

    const request = new connectionRequest({
      userId:user._id,
      connectionId: connectionUser._id
    })

    await request.save();
    
    return res.json({message: "Request sent"});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const getMyConnectionRequests = async(req, res) => {
  try {

    const {token} = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    

    const connections = await connectionRequest.find({userId: user._id})
    .populate("connectionId", "name username email profilePicture");

    return res.json({connections});

  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
}


export const whatAreMyConnections = async (req, res) => {
  try {

     const {token} = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    

    const connections = await connectionRequest.find({connectionId: user._id})
    .populate("userId", "name username email profilePicture");

    return res.json(connections);

  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
}

//ACCEPTS CONNECTIONS

export const acceptConnectionsRequests = async(req, res) => {
  try {

    const {token, requestId, action_type} = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connection = await connectionRequest.findOne({_id: requestId});


    if(!connection) {
      return res.status(404).json({message: "Connection not found!"});
    }
    

    if(action_type === "accept") {
      connection.status_accepted = true;
    } else{
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({message: "Request Updated!"});
     

  } catch (error) {
     return res.status(500).json({ message: error.message }); 
  }
}

//ADD COMMENT
export const commentPost = async(req, res) => {
  try {

   
    const {token , post_id, commentBody} = req.body;

     const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

     const post = await Post.findOne({ _id : post_id  });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

   const comment = new Comment({
    userId: user._id,
    postId: post._id,
    body: commentBody
   })


   await comment.save();

   return res.status(200).json({message: "Comment Added!"});
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userProfile = await Profile.findOne({ userId: user._id });

    return res.json({
      user,
      profile: userProfile
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};