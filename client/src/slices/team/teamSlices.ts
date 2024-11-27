import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import callApi from "../../misc/callApi";
import { roleMap } from "../../misc";

type RoleKeys = keyof typeof roleMap;

export interface User {
  userId?: string;
  createdAt?: string;
  email?: string;
  isActive?: boolean;
  name?: string;
  password?: string;
  role?: RoleKeys;
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

interface InitialListState {
  status: "idle" | "pending" | "success" | "failed";
  data: User[];
}
interface InitialCreateState {
  status: "idle" | "pending" | "success" | "failed";
  data: any[];
}

interface InitialTeamViewState {
  status: "idle" | "pending" | "success" | "failed";
  data: User;
}

const initialListState: InitialListState = {
  status: "idle",
  data: [],
};

const initialCreateState: InitialCreateState = {
  status: "idle",
  data: [],
};

const initialTeamViewState: InitialTeamViewState = {
  status: "idle",
  data: {},
};

export const teamListApi = createAsyncThunk("teamList", async () => {
  const response: any = await callApi("http://localhost:8000/team/list", "get");
  return response.data;
});

export const teamCreateApi = createAsyncThunk(
  "teamCreate",
  async (teamData: TeamData) => {
    const response: any = await callApi(
      "http://localhost:8000/team/add",
      "post",
      teamData
    );
    return response.data;
  }
);

export const teamDetailsApi = createAsyncThunk(
  "teamDetails",
  async (userId: string) => {
    const response: any = await callApi(
      `http://localhost:8000/team/view/${userId}`,
      "get"
    );
    return response.data;
  }
);

export const teamListSlice = createSlice({
  name: "teamList",
  initialState: initialListState,
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

export const teamCreateSlice = createSlice({
  name: "teamCreate",
  initialState: initialCreateState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(teamCreateApi.fulfilled, (state, action: any) => {
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(teamCreateApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(teamCreateApi.rejected, (state, action: any) => {
      state.status = "failed";
      state.data = action.payload;
    });
  },
});

export const teamDetailsSlice = createSlice({
  name: "teamDetails",
  initialState: initialTeamViewState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(teamDetailsApi.fulfilled, (state, action: any) => {
      state.status = "success";
      state.data = action.payload?.usersDetails?.[0];
    });
    builder.addCase(teamDetailsApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(teamDetailsApi.rejected, (state, action: any) => {
      state.status = "failed";
      state.data = action.payload;
    });
  },
});

export const teamListReducer = teamListSlice.reducer;
export const teamCreateReducer = teamCreateSlice.reducer;
export const teamDetailsReducer = teamDetailsSlice.reducer;
