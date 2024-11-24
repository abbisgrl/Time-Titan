import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import callApi from "../../misc/callApi";

export interface User {
  userId: string;
  createdAt: string;
  email: string;
  isActive: boolean;
  name: string;
  password: string;
  role: string;
  updatedAt: string;
  __v: number;
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
  const response: any = await callApi("http://localhost:8000/team/list", "get");
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

export const teamListReducer = teamListSlice.reducer;
