// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../auth/AxiosInstance";
import setAuthToken from "../../auth/setAuthToken";

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log(response, "response");
      if (navigate) navigate("/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getCurrency = createAsyncThunk(
  "auth/getCurrency",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/currency/single?_id=671605b99900b9a94e974c11", {
     
      });
      console.log(response, "currency");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Signup user
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ userData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/signup", userData);
      console.log(response, "response");
      if (navigate) navigate("/login");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      // Clear redux state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear axios default header
      setAuthToken(null);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;
        console.log(action.payload, "action.payload");

        // Check if accessToken exists before using it
        if (action.payload && action.payload.accessToken) {
          setAuthToken(action.payload.accessToken);
          localStorage.setItem("token", action.payload.accessToken);
        } else {
          console.error("No access token received from server");
        }

        // Store user data if it exists
        if (action.payload && action.payload.user) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || { message: "Authentication failed" };
        // Don't try to set token on rejection
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        // Store user and token on signup, just like login
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }

        // Check if accessToken exists before using it
        if (action.payload && action.payload.accessToken) {
          setAuthToken(action.payload.accessToken);
          localStorage.setItem("token", action.payload.accessToken);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || { message: "Signup failed" };
      })
      .addCase(getCurrency.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrency.fulfilled, (state) => {
        state.status = "succeeded";
        // state.user = action.payload.user;
        // setAuthToken(action.payload.accessToken);
      })
      .addCase(getCurrency.rejected, (state) => {
        state.status = "failed";
        // state.error = action.payload.user;
        // setAuthToken(action.payload.accessToken);
      });
  },
});

export const { setCredentials, logoutUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;