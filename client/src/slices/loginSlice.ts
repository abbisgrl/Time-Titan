import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// First, create the thunk
export const loginApi = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios({
      method: "post",
      url: "http://localhost:8001",
      data: {
        email,
        password,
      },
    });
    return response.data;
  }
);

interface loginState {
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: loginState = {
  loading: "idle",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginApi.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(loginApi.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(loginApi.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export default loginSlice.reducer;
