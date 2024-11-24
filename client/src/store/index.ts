import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, userDetailsReducer } from "../slices/auth/authSlices";
import { teamListReducer } from "../slices/team/teamSlices";
import {
  createProjectReducer,
  getProjectListReducer,
} from "../slices/project/projectSlices";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    teamList: teamListReducer,
    createProject: createProjectReducer,
    userDetails: userDetailsReducer,
    projectList: getProjectListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
