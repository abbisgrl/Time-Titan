/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callApi from "../../misc/callApi";

const API_URL = process.env.VITE_API_URL;

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
  stage: "todo" | "in-progress" | "qa-testing" | "pm-testing" | "completed";
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
  team: { label?: string; value?: string } | string[];
  taskId?: string;
}

export interface SubTaskData {
  title: string;
  description: string;
  dueDate: Date;
  tag: string;
  taskId: string;
  status: string;
  subTaskId: string;
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
  trashTask: ApiState<any[]>;
  deleteTask: ApiState<any[]>;
  restoreTask: ApiState<any[]>;
  viewTask: ApiState<{ taskDetails: Task }>;
  subtask: ApiState<any[]>;
  addComment: ApiState<any[]>;
  subtaskUpdate: ApiState<any[]>;
  subTaskView: ApiState<{ subTaskDetails: SubTaskData }>;
  subTaskDelete: ApiState<any[]>;
}

export const taskApi = {
  create: createAsyncThunk<any[], TaskData>(
    "team/create",
    async (taskData: TaskData) => {
      const response = await callApi(
        `${API_URL}/tasks/create`,
        "post",
        taskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  list: createAsyncThunk<
    any[],
    {
      status: string;
      isTrashed: boolean;
      projectId: string;
      searchText?: string;
    }
  >(
    "team/list",
    async ({
      status,
      isTrashed,
      projectId,
      searchText,
    }: {
      status: string;
      isTrashed: boolean;
      projectId: string;
      searchText?: string;
    }) => {
      const response = await callApi(
        `${API_URL}/tasks/list/${projectId}?status=${status}&isTrashed=${isTrashed}&searchQuery=${
          searchText || ""
        } `,
        "get"
      );
      return (response as { data: any[] }).data;
    }
  ),
  viewTask: createAsyncThunk<any[], { taskId: string }>(
    "team/viewTask",
    async ({ taskId }: { taskId: string }) => {
      const response = await callApi(`${API_URL}/tasks/view/${taskId}`, "get");
      return (response as { data: any[] }).data;
    }
  ),
  updateTask: createAsyncThunk<any[], TaskData>(
    "team/updateTask",
    async (taskData: TaskData) => {
      const response = await callApi(
        `${API_URL}/tasks/update`,
        "post",
        taskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  trashTask: createAsyncThunk<any[], { taskId: string }>(
    "team/trashTask",
    async ({ taskId }: { taskId: string }) => {
      const response = await callApi(`${API_URL}/tasks/trash/${taskId}`, "put");
      return (response as { data: any[] }).data;
    }
  ),
  deleteTask: createAsyncThunk<any[], { taskId: string }>(
    "team/deleteTask",
    async ({ taskId }: { taskId: string }) => {
      const response = await callApi(
        `${API_URL}/tasks/delete/${taskId}`,
        "delete"
      );
      return (response as { data: any[] }).data;
    }
  ),
  restoreTask: createAsyncThunk<any[], { taskId: string }>(
    "team/restoreTask",
    async ({ taskId }: { taskId: string }) => {
      const response = await callApi(
        `${API_URL}/tasks/restoreTask/${taskId}`,
        "put"
      );
      return (response as { data: any[] }).data;
    }
  ),
  subTaskCreate: createAsyncThunk<any[], Partial<SubTaskData>>(
    "team/subtask",
    async (subtaskData: Partial<SubTaskData>) => {
      const response = await callApi(
        `${API_URL}/tasks/subtask/create`,
        "post",
        subtaskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  subTaskUpdate: createAsyncThunk<any[], any>(
    "team/subtaskUpdate",
    async (subtaskData: any) => {
      const response = await callApi(
        `${API_URL}/tasks/subtask/update`,
        "post",
        subtaskData
      );
      return (response as { data: any[] }).data;
    }
  ),
  subTaskView: createAsyncThunk<any[], { subTaskId: string }>(
    "team/subTaskView",
    async ({ subTaskId }: { subTaskId: string }) => {
      const response = await callApi(
        `${API_URL}/tasks/subtask/view/${subTaskId}`,
        "get"
      );
      return (response as { data: any[] }).data;
    }
  ),
  subTaskDelete: createAsyncThunk<any[], { subTaskId: string }>(
    "team/subTaskDelete",
    async ({ subTaskId }: { subTaskId: string }) => {
      const response = await callApi(
        `${API_URL}/tasks/subtask/delete/${subTaskId}`,
        "delete"
      );
      return (response as { data: any[] }).data;
    }
  ),
  addComment: createAsyncThunk<any[], CommentData>(
    "team/addComment",
    async (commentData: CommentData) => {
      const response = await callApi(
        `${API_URL}/tasks/add/comment`,
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
  trashTask: { status: "idle", data: [] },
  deleteTask: { status: "idle", data: [] },
  restoreTask: { status: "idle", data: [] },
  viewTask: { status: "idle", data: { taskDetails: {} as Task } },
  subtask: { status: "idle", data: [] },
  addComment: { status: "idle", data: [] },
  subtaskUpdate: { status: "idle", data: [] },
  subTaskView: { status: "idle", data: { subTaskDetails: {} as SubTaskData } },
  subTaskDelete: { status: "idle", data: [] },
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
