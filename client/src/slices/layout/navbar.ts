import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbarSlice",
  initialState: {
    currentProject: { projectId: "" },
    searchText: "",
    isSideMenuCollapsed: false,
  },
  reducers: {
    selectCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    searchTextReducer: (state, action) => {
      state.searchText = action.payload;
    },
    isSideMenuCollapsed: (state, action) => {
      state.isSideMenuCollapsed = action.payload;
    },
  },
});

export const { selectCurrentProject, searchTextReducer, isSideMenuCollapsed } =
  navbarSlice.actions;
export default navbarSlice.reducer;
