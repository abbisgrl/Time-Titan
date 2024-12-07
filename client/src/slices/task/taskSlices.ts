import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

export interface TaskData {
  title: string;
  description: string;
  priority: string;
  stage: string;
  subTasks: string[];
  team: { label?: string; value?: string };
}

interface ApiState<T> {
  status: "idle" | "pending" | "success" | "failed";
  data: T;
}

interface TaskState {
  create: ApiState<any[]>;
  list: ApiState<any[]>;
}

export const taskApi = {
  create: createAsyncThunk<any[], TaskData>(
    "team/create",
    async (taskData: TaskData) => {
      const response = await callApi(
        "http://localhost:8000/tasks/create",
        "post",
        taskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  list: createAsyncThunk<any[], { status: string; projectId: string }>(
    "team/list",
    async ({ status, projectId }: { status: string; projectId: string }) => {
      const response = await callApi(
        `http://localhost:8000/tasks/list/${projectId}?status=${status}`,
        "get"
      );
      return (response as { data: any[] }).data;
    }
  ),
};

// Initial state
const initialState: TaskState = {
  create: { status: "idle", data: [] },
  list: { status: "idle", data: [] },
};

// Slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    Object.values(taskApi).forEach((api) => {
      builder
        .addCase(api.fulfilled, (state, action: PayloadAction<any>) => {
          const key = api.typePrefix.split("/")[1] as keyof TaskState;
          state[key].status = "success";
          state[key].data = action.payload;
        })
        .addCase(api.pending, (state, action) => {
          const key = action.type.split("/")[1] as keyof TaskState;
          state[key].status = "pending";
        })
        .addCase(api.rejected, (state, action) => {
          const key = action.type.split("/")[1] as keyof TaskState;
          state[key].status = "failed";
        });
    });
  },
});

export const taskReducer = taskSlice.reducer;
