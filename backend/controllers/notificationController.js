import { AppError } from "../middleware/errorHandler.js";
import Notification from "../models/notification.js";


export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;


    const page       = Math.max(1, parseInt(req.query.page)  || 1);
    const limit      = Math.min(50, parseInt(req.query.limit) || 20);
    const unreadOnly = req.query.unreadOnly === "true";
    const skip       = (page - 1) * limit;

    const filter = {
      userId,
      isDeleted: false,
      ...(unreadOnly && { isRead: false }),
    };

 
    const [notifications, totalCount, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate("senderId", "name avatar headline")  
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),                    

      Notification.countDocuments(filter),

      Notification.unreadCount(userId),                 
    ]);

    return res.status(200).json({
      success: true,
      unreadCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
      },
      notifications,
    });
  } catch (error) {
    next(error);
  }
};


export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;


    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { isRead: true } },
      { new: true }               
    );

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    
    const unreadCount = await Notification.unreadCount(userId);

    return res.status(200).json({
      success: true,
      unreadCount,
      notification,
    });
  } catch (error) {
    next(error);
  }
};



export const markAllRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notification.markAllRead(userId);

    return res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount,
      unreadCount: 0,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};



export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    const unreadCount = await Notification.unreadCount(req.user._id);

    return res.status(200).json({
      success: true,
      unreadCount,
      message: "Notification removed",
    });
  } catch (error) {
    next(error);
  }
};


export const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.unreadCount(req.user._id);

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};