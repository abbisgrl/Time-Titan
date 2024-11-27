import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import callApi from "../../misc/callApi";

interface loginState {
  status: "idle" | "pending" | "success" | "failed";
  data: {
    token?: string;
    [key: string]: any;
  } | null;
}

interface userState {
  status: "idle" | "pending" | "success" | "failed";
  data: {
    name?: string;
    email?: string;
    userId?: string;
  };
}

export const loginApi = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios({
      method: "post",
      url: "http://localhost:8000/auth/login",
      data: {
        email,
        password,
      },
    });
    return response.data;
  }
);

export const userDetailsApi = createAsyncThunk("userDetails", async () => {
  const response: any = await callApi(
    "http://localhost:8000/auth/userDetails",
    "get"
  );
  return response.data;
});

const initialLoginState: loginState = {
  status: "idle",
  data: {},
};

const initialUserDetailsState: userState = {
  status: "idle",
  data: {},
};

export const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginApi.fulfilled, (state, action) => {
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(loginApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(loginApi.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: initialUserDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userDetailsApi.fulfilled, (state, action) => {
      state.status = "success";
      state.data = action.payload;
    });
    builder.addCase(userDetailsApi.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(userDetailsApi.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const loginReducer = loginSlice.reducer;
export const userDetailsReducer = userDetailsSlice.reducer;
