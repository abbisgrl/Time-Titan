import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slices/loginSlice";
import teamListReducer from "../slices/teamListSlice";

export const store = configureStore({
  reducer: { login: loginReducer, teamList: teamListReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
