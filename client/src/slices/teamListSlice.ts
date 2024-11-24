import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface User {
  userId: string; // Unique identifier
  createdAt: string; // ISO 8601 date string
  email: string;
  isActive: boolean;
  name: string;
  password: string; // Assuming this is hashed, so keep it as string
  role: string;
  updatedAt: string; // ISO 8601 date string
  __v: number; // Version key
}

interface InitialState {
  status: "idle" | "pending" | "success" | "failed";
  data: User[];
}

const initialState: InitialState = {
  status: "idle",
  data: [],
};

export const teamListApi = createAsyncThunk("teamList", async () => {
  const response = await axios({
    method: "get",
    url: "http://localhost:8000/team/list",
    headers: { token: Cookies.get("token") },
  });
  return response.data;
});

export const teamListSlice = createSlice({
  name: "teamList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(teamListApi.fulfilled, (state, action: any) => {
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(teamListApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(teamListApi.rejected, (state, action: any) => {
      state.status = "failed";
      state.data = action.payload;
    });
  },
});

export default teamListSlice.reducer;
