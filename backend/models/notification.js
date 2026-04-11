import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },

    
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: [
        "connection_request",   
        "connection_accepted",  
        "job_alert",           
        "profile_view",         
        "post_like",            
        "post_comment",        
        "message",              
        "system",               
      ],
    },

   
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [300, "Message cannot exceed 300 characters"],
    },

    
    link: {
      type: String,
      trim: true,
      default: null,
    },

    
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,           
    },

    
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,       
  }
);



notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });


notificationSchema.index({ userId: 1, createdAt: -1 });


notificationSchema.virtual("timeAgo").get(function () {
  const now = Date.now();
  const diff = Math.floor((now - this.createdAt.getTime()) / 1000); 

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return this.createdAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
});


notificationSchema.statics.unreadCount = async function (userId) {
  return this.countDocuments({ userId, isRead: false, isDeleted: false });
};


notificationSchema.statics.markAllRead = async function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};



notificationSchema.statics.createConnectionRequest = function (
  toUserId,
  fromUser
) {
  return this.create({
    userId: toUserId,
    senderId: fromUser._id,
    type: "connection_request",
    message: `${fromUser.name} sent you a connection request`,
    link: `/profile/${fromUser._id}`,
    meta: { senderName: fromUser.name, senderAvatar: fromUser.avatar },
  });
};

notificationSchema.statics.createConnectionAccepted = function (
  toUserId,
  fromUser
) {
  return this.create({
    userId: toUserId,
    senderId: fromUser._id,
    type: "connection_accepted",
    message: `${fromUser.name} accepted your connection request`,
    link: `/profile/${fromUser._id}`,
    meta: { senderName: fromUser.name, senderAvatar: fromUser.avatar },
  });
};

notificationSchema.statics.createJobAlert = function (userId, job) {
  return this.create({
    userId,
    type: "job_alert",
    message: `New job match: ${job.title} at ${job.company.name}`,
    link: `/jobs?id=${job._id}`,
    meta: { jobTitle: job.title, company: job.company.name, jobId: job._id },
  });
};

notificationSchema.statics.createProfileView = function (toUserId, fromUser) {
  return this.create({
    userId: toUserId,
    senderId: fromUser._id,
    type: "profile_view",
    message: `${fromUser.name} viewed your profile`,
    link: `/profile/${fromUser._id}`,
    meta: { senderName: fromUser.name, senderAvatar: fromUser.avatar },
  });
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;