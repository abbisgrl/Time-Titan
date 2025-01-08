import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    open: false,
    severity: "info",
    title: "",
    message: "",
    autoHideDuration: 6000, // Default duration
  },
  reducers: {
    showAlert: (state, action) => {
      state.open = true;
      state.severity = action.payload.severity;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.autoHideDuration = action.payload.autoHideDuration || 6000; // Set duration or use default
    },
    hideAlert: (state) => {
      state.open = false;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
