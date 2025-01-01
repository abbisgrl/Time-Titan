import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, userDetailsReducer } from "../slices/auth/authSlices";
import { teamReducer } from "../slices/team/teamSlices";
import { projectReducer } from "../slices/project/projectSlices";
import { taskReducer } from "../slices/task/taskSlices";
import { dashboardReducer } from "../slices/dashboard/dashboardSlice";
import navbarReducer from "../slices/layout/navbar";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    projectReducer: projectReducer,
    teamReducer: teamReducer,
    userDetails: userDetailsReducer,
    taskReducer,
    navbarReducer,
    dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
