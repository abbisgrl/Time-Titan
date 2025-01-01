import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

interface ApiState<T> {
  status: "idle" | "pending" | "success" | "failed";
  data: T;
}

interface DashboardState {
  getCardDetails: ApiState<any[]>;
  taskList: ApiState<any[]>;
}

const initialState: DashboardState = {
  getCardDetails: { status: "idle", data: [] },
  taskList: { status: "idle", data: [] },
};

export const dashboardApi = {
  getDashboardCardDetails: createAsyncThunk<any[], string>(
    "dashboard/getCardDetails",
    async (projectId: string) => {
      const response = await callApi(
        `http://localhost:8000/dashboard/cardsDetails/${projectId}`,
        "get"
      );
      return (response as { data: any[] }).data;
    }
  ),
  getDashboardTasksList: createAsyncThunk<any[], string>(
    "dashboard/taskList",
    async (projectId: string) => {
      const response = await callApi(
        `http://localhost:8000/dashboard/taskList/${projectId}`,
        "get"
      );
      return (response as { data: any[] }).data;
    }
  ),
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    Object.values(dashboardApi).forEach((api) => {
      builder
        .addCase(api.fulfilled, (state, action: PayloadAction<any>) => {
          const key = api.typePrefix.split("/")[1] as keyof DashboardState;
          state[key].status = "success";
          state[key].data = action.payload;
        })
        .addCase(api.pending, (state, action) => {
          const key = action.type.split("/")[1] as keyof DashboardState;
          state[key].status = "pending";
        })
        .addCase(api.rejected, (state, action) => {
          const key = action.type.split("/")[1] as keyof DashboardState;
          state[key].status = "failed";
        });
    });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
