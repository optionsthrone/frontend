import { IChat } from "@/types/interfaces/room/room";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IChat[] = [
  {
    userName: "",
    message: "",
    timestamp: "",
  },
];
const chatActions = createSlice({
  name: "chatActions",
  initialState,
  reducers: {
    setChatState: (state, { payload }) => {
      return payload;
    },
  },
});

export const chatMessagesActions = chatActions.actions;
export default chatActions.reducer;
