import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const protect = async (req, res, next) => {
  try {
    let token = null;

    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — please log in",
      });
    }

    
    const userByToken = await User.findOne({ token }).select("-password");

    if (userByToken) {
      req.user = userByToken; 
      return next();
    }

  
    if (process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userByJwt = await User.findById(decoded.id || decoded._id || decoded.userId)
          .select("-password");

        if (userByJwt) {
          req.user = userByJwt;
          return next();
        }
      } catch (jwtErr) {
       
      }
    }

   
    return res.status(401).json({
      success: false,
      message: "Invalid token — please log in again",
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};