import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  userId: string;
}

export interface Task {
  title: string;
  dueDate: string;
  description: string;
  priority: "low" | "medium" | "high";
  stage: "todo" | "in-progress" | "completed";
  comments: any[];
  subTasks: any[];
  assets: any[];
  projectId: string;
  isTrashed: boolean;
  taskId: string;
  activities: any[];
  createdAt: string;
  updatedAt: string;
  teamDetails: TeamMember[];
}

export interface TaskData {
  title: string;
  description: string;
  priority: string;
  stage: string;
  team: { label?: string; value?: string };
  taskId?: string;
}

export interface SubTaskData {
  title: string;
  description: string;
  dueDate: Date;
  tag: string;
  taskId: string;
}

export interface CommentData {
  userId?: string;
  taskId: string;
  comment: string;
}

interface ApiState<T> {
  status: "idle" | "pending" | "success" | "failed";
  data: T;
}

interface TaskState {
  create: ApiState<any[]>;
  updateTask: ApiState<any[]>;
  list: ApiState<{ taskData: Task[] }>;
  deleteTask: ApiState<any[]>;
  viewTask: ApiState<{ taskDetails: Task }>;
  subtask: ApiState<any[]>;
  addComment: ApiState<any[]>;
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
  viewTask: createAsyncThunk<any[], { taskId: string }>(
    "team/viewTask",
    async ({ taskId }: { taskId: string }) => {
      const response = await callApi(
        `http://localhost:8000/tasks/view/${taskId}`,
        "get"
      );
      return (response as { data: any[] }).data;
    }
  ),
  updateTask: createAsyncThunk<any[], TaskData>(
    "team/updateTask",
    async (taskData: TaskData) => {
      const response = await callApi(
        "http://localhost:8000/tasks/update",
        "post",
        taskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  deleteTask: createAsyncThunk<any[], { taskId: string }>(
    "team/deleteTask",
    async ({ taskId }: { taskId: string }) => {
      const response = await callApi(
        `http://localhost:8000/tasks/delete/${taskId}`,
        "delete"
      );
      return (response as { data: any[] }).data;
    }
  ),
  subTaskCreate: createAsyncThunk<any[], SubTaskData>(
    "team/subtask",
    async (subtaskData: SubTaskData) => {
      const response = await callApi(
        "http://localhost:8000/tasks/subtask/create",
        "post",
        subtaskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  addComment: createAsyncThunk<any[], CommentData>(
    "team/addComment",
    async (commentData: CommentData) => {
      const response = await callApi(
        `http://localhost:8000/tasks/add/comment`,
        "post",
        commentData
      );
      return (response as { data: any[] }).data;
    }
  ),
};

// Initial state
const initialState: TaskState = {
  create: { status: "idle", data: [] },
  updateTask: { status: "idle", data: [] },
  list: { status: "idle", data: { taskData: [] as Task[] } },
  deleteTask: { status: "idle", data: [] },
  viewTask: { status: "idle", data: { taskDetails: {} as Task } },
  subtask: { status: "idle", data: [] },
  addComment: { status: "idle", data: [] },
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
