import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbarSlice",
  initialState: { currentProject: { projectId: "" }, searchText: "" },
  reducers: {
    selectCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    searchTextReducer: (state, action) => {
      state.searchText = action.payload;
    },
  },
});

export const { selectCurrentProject, searchTextReducer } = navbarSlice.actions;
export default navbarSlice.reducer;
