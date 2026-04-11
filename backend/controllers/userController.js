import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import connectionRequest from "../models/connectionsModel.js";
import Comment from "../models/commentsModel.js";
import Post from "../models/postsModel.js";
import { AppError } from "../middleware/errorHandler.js";


const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/[^\x00-\x7F]/g, "") 
      .replace(/\n/g, "\n");       
  };

  doc.fontSize(20).font('Helvetica-Bold')
     .text(cleanText(userData.userId.name), { align: 'center' });

  doc.fontSize(12).font('Helvetica')
     .text(`@${userData.userId.username} | ${userData.userId.email}`, { align: 'center' });

  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  if (userData.currentPost) {
    doc.fontSize(13).font('Helvetica-Bold').text('Current Position');
    doc.moveDown(0.3);
    doc.fontSize(12).font('Helvetica')
       .text(cleanText(userData.currentPost));
    doc.moveDown();
  }

  if (userData.bio) {
    doc.fontSize(13).font('Helvetica-Bold').text('Bio');
    doc.moveDown(0.3);
    doc.fontSize(12).font('Helvetica')
       .text(cleanText(userData.bio), { lineGap: 3 });
    doc.moveDown();
  }

  if (userData.pastWork && userData.pastWork.length > 0) {
    doc.fontSize(13).font('Helvetica-Bold').text('Work Experience');
    doc.moveDown(0.3);

    userData.pastWork.forEach((work) => {
      doc.fontSize(12).font('Helvetica-Bold')
         .text(cleanText(work.company || "N/A"), { continued: true });

      doc.font('Helvetica')
         .text(` — ${cleanText(work.position || "N/A")} (${cleanText(work.years || "N/A")})`);
    });

    doc.moveDown();
  }

  if (userData.education && userData.education.length > 0) {
    doc.fontSize(13).font('Helvetica-Bold').text('Education');
    doc.moveDown(0.3);

    userData.education.forEach((edu) => {
      doc.fontSize(12).font('Helvetica-Bold')
         .text(cleanText(edu.school || "N/A"), { continued: true });

      doc.font('Helvetica')
         .text(` — ${cleanText(edu.degree || "N/A")}${edu.fieldOfStudy ? ', ' + cleanText(edu.fieldOfStudy) : ''}`);
    });

    doc.moveDown();
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, username });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
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
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    return res.json({ message: "Login successful!", token });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// LOGOUT
export const logout = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    user.token = "";
    await user.save();
    return res.json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// UPLOAD PROFILE PICTURE
export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Token required!" });

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    if (!req.file) return res.status(400).json({ message: "Image not uploaded!" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({ message: "Profile picture updated!", image: req.file.filename });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const { username, email } = newUserData;

    if (username || email) {
      const query = [];
      if (username) query.push({ username });
      if (email) query.push({ email });

      const existingUser = await User.findOne({ $or: query });
     
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "Username or email already in use!" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User Updated!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// GET USER & PROFILE
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name email username profilePicture");

    return res.json(userProfile);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// UPDATE PROFILE DATA
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const profile = await Profile.findOne({ userId: user._id });
    Object.assign(profile, newProfileData);
    await profile.save();

    return res.json({ message: "Profile Updated!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// GET ALL USER PROFILES
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "name username email profilePicture");
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// DOWNLOAD PROFILE AS PDF
export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
      .populate("userId", "name username email profilePicture");

    if (!userProfile) {
      throw new AppError("Profile not found", 404);
    }

    let outputPath = await convertUserDataToPDF(userProfile);
    return res.json({ message: outputPath });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// SEND CONNECTION REQUEST
export const sendConnectionRequest = async (req, res) => {
  try {
    const { token, connectionId } = req.body;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) throw new AppError("Connection User not found", 404);

  
    if (String(user._id) === String(connectionUser._id)) {
      return res.status(400).json({ message: "You cannot connect with yourself!" });
    }

    const existingRequest = await connectionRequest.findOne({
      $or: [
        { userId: user._id, connectionId: connectionUser._id },
        { userId: connectionUser._id, connectionId: user._id }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const request = new connectionRequest({
      userId: user._id,
      connectionId: connectionUser._id
    });

    await request.save();
    return res.json({ message: "Request sent" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// GET MY SENT CONNECTION REQUESTS
export const getMyConnectionRequests = async (req, res) => {
  try {
   
    const token = req.query.token || req.body.token;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const connections = await connectionRequest.find({ userId: user._id })
      .populate("connectionId", "name username email profilePicture");

    return res.json({ connections });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// GET INCOMING CONNECTION REQUESTS 
export const whatAreMyConnections = async (req, res) => {
  try {
   
    const token = req.query.token || req.body.token;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const connections = await connectionRequest.find({ connectionId: user._id })
      .populate("userId", "name username email profilePicture");

    return res.json({ connections });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ACCEPT / REJECT CONNECTION REQUEST
export const acceptConnectionsRequests = async (req, res) => {
  try {
    const { token, requestId, action_type } = req.body;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    const connection = await connectionRequest.findOne({ _id: requestId });
    if (!connection) throw new AppError("Connection not found", 404);

   
    if (action_type === "accept" || action_type === "accepted") {
      connection.status_accepted = true;
    } else {
   
      await connectionRequest.deleteOne({ _id: requestId });
      return res.json({ message: "Request Rejected!" });
    }

    await connection.save();
    return res.json({ message: "Request Accepted!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ADD COMMENT
export const commentPost = async (req, res) => {
  try {
    const { token, post_id, commentBody } = req.body;

    const user = await User.findOne({ token }).select("_id");
    if (!user) throw new AppError("User not found", 404);

    const post = await Post.findOne({ _id: post_id });
    if (!post) throw new AppError("Post not found", 404);

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody
    });

    await comment.save();
    return res.status(200).json({ message: "Comment Added!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// GET USER PROFILE BY USERNAME
export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    const userProfile = await Profile.findOne({ userId: user._id });

    
    return res.json({
      user: { _id: user._id, name: user.name, username: user.username, email: user.email, profilePicture: user.profilePicture },
      profile: userProfile
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// GET ALL ACCEPTED CONNECTIONS FOR A USER
export const getMyAcceptedConnections = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;

    const user = await User.findOne({ token });
    if (!user) throw new AppError("User not found", 404);

    
    const connections = await connectionRequest.find({
      $or: [
        { userId: user._id, status_accepted: true },
        { connectionId: user._id, status_accepted: true }
      ]
    })
    .populate("userId", "name username email profilePicture")
    .populate("connectionId", "name username email profilePicture");


    const myConnections = connections.map(conn => {
      const isMe = String(conn.userId._id) === String(user._id);
      return {
        _id: conn._id,
        connectedUser: isMe ? conn.connectionId : conn.userId,
        connectedAt: conn._id
      };
    });

    return res.json({ connections: myConnections });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
