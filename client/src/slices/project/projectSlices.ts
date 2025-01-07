/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

const API_URL = import.meta.env.VITE_API_URL;

// Define types
export interface Project {
  userId: string;
}

export interface ProjectList {
  name: string;
  logo: string;
  description: string;
  projectId: string;
}

interface ApiState<T> {
  status: "idle" | "pending" | "success" | "failed";
  data: T;
}

interface ProjectState {
  create: ApiState<Project[]>;
  list: ApiState<ProjectList[]>;
}

export const projectApi = {
  create: createAsyncThunk<Project[], object>(
    "project/create",
    async (data) => {
      const response: any = await callApi(
        `${API_URL}/project/add`,
        "post",
        data
      );
      return response.data;
    }
  ),

  list: createAsyncThunk<ProjectList[], void>("project/list", async () => {
    const response: any = await callApi(`${API_URL}/project/list`, "get");
    return response.data;
  }),
};

const initialState: ProjectState = {
  create: { status: "idle", data: [] },
  list: { status: "idle", data: [] },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    Object.values(projectApi).forEach((api) => {
      builder
        .addCase(api.fulfilled, (state, action: PayloadAction<any>) => {
          const key = api.typePrefix.split("/")[1] as keyof ProjectState;
          state[key].status = "success";
          state[key].data = action.payload;
        })
        .addCase(api.pending, (state, action) => {
          const key = action.type.split("/")[1] as keyof ProjectState;
          state[key].status = "pending";
        })
        .addCase(api.rejected, (state, action) => {
          const key = action.type.split("/")[1] as keyof ProjectState;
          state[key].status = "failed";
        });
    });
  },
});

export const projectReducer = projectSlice.reducer;
