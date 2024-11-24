import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// First, create the thunk
export const loginApi = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios({
      method: "post",
      url: "http://localhost:8000/auth/login",
      data: {
        email,
        password,
      },
    });
    return response.data;
  }
);

interface loginState {
  status: "idle" | "pending" | "success" | "failed";
  data: {
    token?: string; // Optional because it might not exist initially
    [key: string]: any; // To allow additional fields if needed
  } | null;
}

const initialState: loginState = {
  status: "idle",
  data: {},
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginApi.fulfilled, (state, action) => {
      console.log("inside the success block");
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(loginApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(loginApi.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export default loginSlice.reducer;
