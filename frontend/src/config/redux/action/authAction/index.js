import { clientServer } from "../../../index";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({ message: "Token not provided!" });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);


export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        name: user.name,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
  }
);


export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await clientServer.post("/logout", { token });
      localStorage.removeItem("token");
      return thunkAPI.fulfillWithValue({});
    } catch (error) {
      localStorage.removeItem("token");
      return thunkAPI.fulfillWithValue({});
    }
  }
);


export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to fetch user" });
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        ...data,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Update failed" });
    }
  }
);


export const updateProfileData = createAsyncThunk(
  "user/updateProfileData",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        ...data,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Profile update failed" });
    }
  }
);


export const uploadProfilePicture = createAsyncThunk(
  "user/uploadProfilePicture",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("profile_picture", file);

      const response = await clientServer.post("/update_profile_picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Upload failed" });
    }
  }
);


export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("user/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to fetch users" });
    }
  }
);


export const getUserByUsername = createAsyncThunk(
  "user/getUserByUsername",
  async (username, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_profile_based_on_username", {
        params: { username },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "User not found" });
    }
  }
);


export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/send_connection_request", {
        token: user.token,
        connectionId: user.user_id,
      });
      return thunkAPI.fulfillWithValue({ ...response.data, connectionId: user.user_id });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to send request" });
    }
  }
);



export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkAPI) => {
    try {
     
      const response = await clientServer.get("/user/getConnectionRequests", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);



export const getMyConnectionRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async (user, thunkAPI) => {
    try {
   
      const response = await clientServer.get("/user/user_connection_request", {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);


export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/accept_connection_request", {
        token: user.token,
        requestId: user.requestId,
  
        action_type: user.action === "accepted" ? "accept" : user.action,
      });
      return thunkAPI.fulfillWithValue({ ...response.data, requestId: user.requestId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);


export const getMyAcceptedConnections = createAsyncThunk(
  "user/getMyAcceptedConnections",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/my_accepted_connections", {
        params: { token: localStorage.getItem("token") },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);
