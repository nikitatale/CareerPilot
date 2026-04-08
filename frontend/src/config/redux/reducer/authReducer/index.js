import { createSlice } from "@reduxjs/toolkit";
import {
  acceptConnection,
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  getMyAcceptedConnections,
  getMyConnectionRequest,
  getUserByUsername,
  loginUser,
  logoutUser,
  registerUser,
  sendConnectionRequest,
  updateProfileData,
  updateUserProfile,
  uploadProfilePicture,
} from "../../action/authAction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  incomingRequests: [],
  acceptedConnections: [],
  all_users: [],
  all_profiles_fetched: false,
  viewed_profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    resetAuth: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.loggedIn = false;
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
    clearViewedProfile: (state) => {
      state.viewed_profile = null;
    },
  },

  extraReducers: (builder) => {
    builder
  
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

     
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

  
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState };
      })

     
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileFetched = true;
        state.user = action.payload;
      })
      .addCase(getAboutUser.rejected, (state) => {
        state.profileFetched = false;
      })

      
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.isSuccess = true;
        state.message = "Profile updated!";
      })

    
      .addCase(updateProfileData.fulfilled, (state) => {
        state.isSuccess = true;
        state.message = "Profile data updated!";
      })

      
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        if (state.user?.userId) {
          state.user.userId.profilePicture = action.payload.image;
        }
      })

     
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })

      
      .addCase(getUserByUsername.fulfilled, (state, action) => {
        state.viewed_profile = {
          ...action.payload.profile,
          userId: action.payload.user,
        };
      })

     
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload || [];
      })
      .addCase(getConnectionRequest.rejected, (state) => {
        state.connections = [];
      })

  
      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.incomingRequests = action.payload || [];
      })
      .addCase(getMyConnectionRequest.rejected, (state) => {
        state.incomingRequests = [];
      })

   
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.connections.push({
          connectionId: { _id: action.payload.connectionId },
          status_accepted: null,
        });
      })

    
      .addCase(acceptConnection.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        
        state.incomingRequests = state.incomingRequests.filter(
          (req) => String(req._id) !== String(requestId)
        );
      })

      
      .addCase(getMyAcceptedConnections.fulfilled, (state, action) => {
        state.acceptedConnections = action.payload || [];
      });
  },
});

export const {
  reset,
  setTokenIsThere,
  setTokenIsNotThere,
  resetAuth,
  clearViewedProfile,
} = authSlice.actions;

export default authSlice.reducer;
