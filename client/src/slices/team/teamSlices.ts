/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

// Define types
export interface User {
  userId?: string;
  createdAt?: string;
  email?: string;
  isActive?: boolean;
  name?: string;
  status?: string;
  role?: string;
  updatedAt?: string;
  memberPassword?: string;
  ownerId?: string;
  projects?: string[];
  __v?: number;
}

export interface TeamData {
  name: string;
  email: string;
  password: string;
  role: string;
  projects: string[];
  ownerId?: string;
}

interface ApiState<T> {
  status: "idle" | "pending" | "success" | "failed";
  data: T;
}

interface TeamState {
  list: ApiState<User[]>;
  create: ApiState<any[]>;
  details: ApiState<User>;
  delete: ApiState<User>;
  update: ApiState<User>;
  projectsTeamList: ApiState<User[]>;
}

export const teamApi = {
  list: createAsyncThunk<
    User[],
    {
      searchText?: string;
    }
  >("team/list", async ({ searchText }: { searchText?: string }) => {
    const response = await callApi(
      `http://localhost:8000/team/list?searchQuery=${searchText || ""}`,
      "get"
    );
    return (response as { data: User[] }).data;
  }),
  create: createAsyncThunk<any[], TeamData>(
    "team/create",
    async (teamData: TeamData) => {
      const response = await callApi(
        "http://localhost:8000/team/add",
        "post",
        teamData
      );
      return (response as { data: any[] }).data;
    }
  ),

  details: createAsyncThunk<User, string>(
    "team/details",
    async (userId: string) => {
      const response = await callApi(
        `http://localhost:8000/team/view/${userId}`,
        "get"
      );
      return (response as { data: User }).data;
    }
  ),

  update: createAsyncThunk<User, { teamData: TeamData; userId: string }>(
    "team/update",
    async ({ teamData, userId }) => {
      const response = await callApi(
        `http://localhost:8000/team/update/${userId}`,
        "put",
        teamData
      );
      return (response as { data: User }).data;
    }
  ),

  delete: createAsyncThunk<User, string>(
    "team/delete",
    async (userId: string) => {
      const response = await callApi(
        `http://localhost:8000/team/delete/${userId}`,
        "delete"
      );
      return (response as { data: User }).data;
    }
  ),

  projectTeamList: createAsyncThunk<User, string>(
    "team/projectsTeamList",
    async (projectId: string) => {
      const response = await callApi(
        `http://localhost:8000/team/projects/team/list/${projectId}`,
        "get"
      );
      return (response as { data: User }).data;
    }
  ),
};

// Initial state
const initialState: TeamState = {
  list: { status: "idle", data: [] },
  create: { status: "idle", data: [] },
  details: { status: "idle", data: {} },
  update: { status: "idle", data: {} },
  delete: { status: "idle", data: {} },
  projectsTeamList: { status: "idle", data: [] },
};

// Slice
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    Object.values(teamApi).forEach((api) => {
      builder
        .addCase(api.fulfilled, (state, action: PayloadAction<any>) => {
          const key = api.typePrefix.split("/")[1] as keyof TeamState;
          state[key].status = "success";
          state[key].data = action.payload;
        })
        .addCase(api.pending, (state, action) => {
          const key = action.type.split("/")[1] as keyof TeamState;
          state[key].status = "pending";
        })
        .addCase(api.rejected, (state, action) => {
          const key = action.type.split("/")[1] as keyof TeamState;
          state[key].status = "failed";
        });
    });
  },
});

export const teamReducer = teamSlice.reducer;
