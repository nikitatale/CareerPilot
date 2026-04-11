import User from "../models/userModel.js";



export const updateVisibility = async (req, res, next) => {
  try {
    const { profileVisibility, browseMode } = req.body;

   
    const allowedVisibility = ["public", "connections", "recruiters"];
    if (profileVisibility && !allowedVisibility.includes(profileVisibility)) {
      return res.status(400).json({
        success: false,
        message: `profileVisibility must be one of: ${allowedVisibility.join(", ")}`,
      });
    }

   
    const updates = {};
    if (profileVisibility !== undefined) {
      updates["settings.profileVisibility"] = profileVisibility;
    }
    if (browseMode !== undefined) {
      updates["settings.browseMode"] = Boolean(browseMode); 
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("settings name email");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Visibility settings updated",
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};



export const updateOpenToWork = async (req, res, next) => {
  try {
    const {
      isOpenToWork,
      openToWorkVisibility, 
      jobPreferences,       
    } = req.body;

    const allowedVisibility = ["everyone", "recruiters"];
    if (
      openToWorkVisibility &&
      !allowedVisibility.includes(openToWorkVisibility)
    ) {
      return res.status(400).json({
        success: false,
        message: `openToWorkVisibility must be one of: ${allowedVisibility.join(", ")}`,
      });
    }

    const updates = {};

    if (isOpenToWork !== undefined) {
      updates["settings.isOpenToWork"] = Boolean(isOpenToWork);
    }
    if (openToWorkVisibility !== undefined) {
      updates["settings.openToWorkVisibility"] = openToWorkVisibility;
    }


    if (jobPreferences) {
      const { roles, locations, employmentTypes, expectedSalary } = jobPreferences;

      if (roles !== undefined) {
        updates["settings.jobPreferences.roles"] = roles; 
      }
      if (locations !== undefined) {
        updates["settings.jobPreferences.locations"] = locations;
      }
      if (employmentTypes !== undefined) {
        const allowed = ["fulltime", "parttime", "contract", "internship"];
        const invalid = employmentTypes.filter((t) => !allowed.includes(t));
        if (invalid.length) {
          return res.status(400).json({
            success: false,
            message: `Invalid employmentType(s): ${invalid.join(", ")}`,
          });
        }
        updates["settings.jobPreferences.employmentTypes"] = employmentTypes;
      }
      if (expectedSalary !== undefined) {
        updates["settings.jobPreferences.expectedSalary"] = expectedSalary; 
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("settings name");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: isOpenToWork
        ? "You are now open to work"
        : "Open to work status turned off",
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};


export const updateNotificationPrefs = async (req, res, next) => {
  try {
    const { email, push, inApp } = req.body;

  
    const validChannels = ["email", "push", "inApp"];
    const validEvents = [
      "connectionRequests",
      "connectionAccepted",
      "jobAlerts",
      "profileViews",
      "postLikes",
      "postComments",
      "messages",
      "systemUpdates",
    ];

    const updates = {};

    const channels = { email, push, inApp };

    for (const [channel, prefs] of Object.entries(channels)) {
      if (!prefs || typeof prefs !== "object") continue;

      for (const [event, value] of Object.entries(prefs)) {
        if (!validEvents.includes(event)) {
          return res.status(400).json({
            success: false,
            message: `Invalid notification event: "${event}". Must be one of: ${validEvents.join(", ")}`,
          });
        }
        
        updates[`settings.notifications.${channel}.${event}`] = Boolean(value);
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid notification preferences provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("settings");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated",
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};



export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("settings name email avatar")
      .lean();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};



export const updateAccount = async (req, res, next) => {
  try {
    const { name, headline, email } = req.body;

   
    const BLOCKED = ["password", "passwordHash", "role", "_id"];
    const attempted = BLOCKED.filter((f) => req.body[f] !== undefined);
    if (attempted.length) {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${attempted.join(", ")} via this endpoint`,
      });
    }

    const updates = {};
    if (name?.trim())     updates.name     = name.trim();
    if (headline?.trim()) updates.headline = headline.trim();
    if (email?.trim()) {
      
      const existing = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
      updates.email = email.trim().toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "Account updated",
      user,
    });
  } catch (error) {
    next(error);
  }
};



export const deactivateAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { isActive: false, deactivatedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Account deactivated. You can reactivate by logging in again.",
    });
  } catch (error) {
    next(error);
  }
};