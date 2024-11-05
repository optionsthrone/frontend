import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
  isOpen?: boolean;
  status?: "error" | "success" | "info";
  message?: string;
}

const initialState: SnackbarState = {
  isOpen: false,
  status: "info",
  message: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    toggleCloseSnackbar: (state) => {
      state.isOpen = false;
      state.message = "";
      state.status = "info";
    },
    toggleErrorSnackbar: (state, action: PayloadAction<SnackbarState>) => {
      state.isOpen = true;
      state.message = action.payload.message
        ? action.payload.message
        : "Sorry! We are having trouble completing your request. Please try again later.";
      state.status = "error";
    },
    toggleSuccessSnackbar: (state, action: PayloadAction<SnackbarState>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.status = "success";
    },
    toggleInfoSnackbar: (state, action: PayloadAction<SnackbarState>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.status = "info";
    },
  },
});

export const snackbarActions = snackbarSlice.actions;
export const snackbarReducer = snackbarSlice.reducer;
