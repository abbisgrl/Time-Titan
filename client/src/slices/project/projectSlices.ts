import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

export interface Project {
  userId: string;
}

export interface ProjectList {
  name: string;
  logo: string;
  description: string;
  projectId: string;
}

interface InitialCreateProjectState {
  status: "idle" | "pending" | "success" | "failed";
  data: Project[];
}

export interface InitialProjectList {
  status: "idle" | "pending" | "success" | "failed";
  data: ProjectList[];
}

const initialCreateProjectState: InitialCreateProjectState = {
  status: "idle",
  data: [],
};

const initialProjectListState: InitialProjectList = {
  status: "idle",
  data: [],
};

export const createProject = createAsyncThunk(
  "createProject",
  async (data: object) => {
    const response: any = await callApi(
      "http://localhost:8000/project/add",
      "post",
      data
    );
    return response.data;
  }
);

export const getProjectsListApi = createAsyncThunk("projectsList", async () => {
  const response: any = await callApi(
    "http://localhost:8000/project/list",
    "get"
  );
  return response.data;
});

export const createProjectSlice = createSlice({
  name: "project",
  initialState: initialCreateProjectState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createProject.fulfilled, (state, action: any) => {
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(createProject.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(createProject.rejected, (state, action: any) => {
      state.status = "failed";
      state.data = action.payload;
    });
  },
});

export const getProjectsListSlice = createSlice({
  name: "projectsList",
  initialState: initialProjectListState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectsListApi.fulfilled, (state, action: any) => {
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(getProjectsListApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getProjectsListApi.rejected, (state, action: any) => {
      state.status = "failed";
      state.data = action.payload;
    });
  },
});

export const createProjectReducer = createProjectSlice.reducer;
export const getProjectListReducer = getProjectsListSlice.reducer;
