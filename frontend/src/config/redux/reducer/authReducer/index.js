import { createSlice } from "@reduxjs/toolkit"
import { acceptConnection, getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequest, getUserByUsername, loginUser, registerUser, sendConnectionRequest } from "../../action/authAction"

const initialState = {
    user: {},
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
    all_users: [],
    all_profiles_fetched: false,
    viewed_profile: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        resetAuth: (state) => {         
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.loggedIn = false;
            state.message = "";
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere : (state) => {
            state.isTokenThere = false
            
        } 
    },

    extraReducers: (builder) => {
      builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;   
        state.isSuccess = false;  
        state.message = "";       
      })
      .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.loggedIn = true;
          state.message = "Login is successful";
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
      .addCase(registerUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.loggedIn = false;
          state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
    .addCase(getAboutUser.fulfilled, (state, action) => {
    console.log(" FULFILLED TRIGGERED", action.payload);
    state.isLoading = false;
    state.isError = false;
    state.profileFetched = true;
    state.user = action.payload;
     })
       .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
       })
       .addCase(getUserByUsername.fulfilled, (state, action) => {
        state.viewed_profile = action.payload.profile
        })
        .addCase(getConnectionRequest.fulfilled, (state, action) => {
            state.connections = action.payload
        })
        .addCase(getConnectionRequest.rejected, (state, action) => {
            state.message = action.payload
        })
        .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
            state.connectionRequest = action.payload
              state.incomingRequests = action.payload;
        })
        .addCase(getMyConnectionRequest.rejected, (state, action) => {
            state.message = action.payload
        })
        .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.connections.push({
        connectionId: { _id: action.payload.connectionId },
        status_accepted: false
  })
})

.addCase(acceptConnection.fulfilled, (state, action) => {
  const id = action.meta.arg.connectionId;

  state.connections = state.connections.map(conn => {
    if (
      conn.connectionId?._id === id ||
      conn.userId?._id === id
    ) {
      return { ...conn, status_accepted: true };
    }
    return conn;
  });

  state.incomingRequests = state.incomingRequests.filter(
    req => req.userId._id !== id
  );
})
    }
})

export const { reset, setTokenIsThere, setTokenIsNotThere, handleLoginUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;