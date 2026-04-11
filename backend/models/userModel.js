import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    default: ''
  },
  headline: {
    type: String,
    default: ''
  },


  settings: {
    profileVisibility: {
      type: String,
      enum: ["public", "connections", "recruiters"],
      default: "public"
    },
    browseMode:           { type: Boolean, default: false },
    isOpenToWork:         { type: Boolean, default: false },
    openToWorkVisibility: {
      type: String,
      enum: ["everyone", "recruiters"],
      default: "recruiters"
    },
    notifications: {
      email: {
        connectionRequests: { type: Boolean, default: true },
        connectionAccepted: { type: Boolean, default: true },
        jobAlerts:          { type: Boolean, default: true },
        profileViews:       { type: Boolean, default: false },
        postLikes:          { type: Boolean, default: false },
        postComments:       { type: Boolean, default: true },
        messages:           { type: Boolean, default: true },
        systemUpdates:      { type: Boolean, default: true },
      },
      inApp: {
        connectionRequests: { type: Boolean, default: true },
        connectionAccepted: { type: Boolean, default: true },
        jobAlerts:          { type: Boolean, default: true },
        profileViews:       { type: Boolean, default: true },
        postLikes:          { type: Boolean, default: true },
        postComments:       { type: Boolean, default: true },
        messages:           { type: Boolean, default: true },
        systemUpdates:      { type: Boolean, default: true },
      },
    },
  },
});

const User = mongoose.model('User', UserSchema);
export default User;