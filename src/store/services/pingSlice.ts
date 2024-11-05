import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sentTimestamp: 0,
  receivedTimestamp: 0,
};

const pingSlice = createSlice({
  name: "pingData",
  initialState,
  reducers: {
    setSentTimestamp: (state, { payload }) => {
      state.sentTimestamp = payload;
    },
    setReceivedTimestamp: (state, { payload }) => {
      state.receivedTimestamp = payload;
    },
  },
});

export const pingActions = pingSlice.actions;
export default pingSlice.reducer;
