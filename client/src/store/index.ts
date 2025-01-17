import { configureStore } from "@reduxjs/toolkit";
import {
  createPasswordReducer,
  loginReducer,
  userDetailsReducer,
  signupReducer,
} from "../slices/auth/authSlices";
import { teamReducer } from "../slices/team/teamSlices";
import { projectReducer } from "../slices/project/projectSlices";
import { taskReducer } from "../slices/task/taskSlices";
import { dashboardReducer } from "../slices/dashboard/dashboardSlice";
import navbarReducer from "../slices/layout/navbar";
import alertSlice from "../slices/layout/showAlert";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    signupReducer,
    createPasswordReducer,
    projectReducer: projectReducer,
    teamReducer: teamReducer,
    userDetails: userDetailsReducer,
    taskReducer,
    navbarReducer,
    dashboardReducer,
    alertSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
