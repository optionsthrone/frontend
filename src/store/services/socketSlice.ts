import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IsocketData } from "@/types/interfaces/socket";
import { IReceivedData } from "@/types/interfaces/socket";

const initialState: IsocketData = {
  isSocket: false,
  receivedData: null,
  isWebSocketErrorResponse: false,
  webSocketErrorResponse: "",
  isConnected: false,
  actionPending: "",
};

const socketSlice = createSlice({
  name: "socketData",
  initialState,
  reducers: {
    setReceivedData: (
      state,
      { payload }: PayloadAction<IReceivedData | null>
    ) => {
      state.receivedData = payload;
    },
    setWebSocketErrorResponse: (
      state,
      { payload }: PayloadAction<string | null>
    ) => {
      state.isWebSocketErrorResponse = payload === null ? false : true;
      state.webSocketErrorResponse = payload;
    },
    setIsConnected: (state, { payload }: PayloadAction<boolean>) => {
      state.isConnected = payload;
      state.isSocket = payload;
    },
    setActionPending: (state, { payload }: PayloadAction<string | null>) => {
      state.actionPending = payload;
    },
  },
});

export const socketActions = socketSlice.actions;
export default socketSlice.reducer;
