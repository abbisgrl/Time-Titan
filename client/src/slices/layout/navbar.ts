import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbarSlice",
  initialState: { currentProject: { projectId: "" } },
  reducers: {
    selectCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
});

export const { selectCurrentProject } = navbarSlice.actions;
export default navbarSlice.reducer;
