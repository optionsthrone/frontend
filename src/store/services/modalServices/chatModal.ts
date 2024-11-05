import { createSlice } from "@reduxjs/toolkit";
interface IChatModalProps {
  isOpen: boolean;
}

const initialState: IChatModalProps = {
  isOpen: false,
};

const ChatModal = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    closeChatModal: (state) => {
      state.isOpen = false;
    },
    openChatModal: (state) => {
      state.isOpen = true;
    },
  },
});

export const ChatModalActions = ChatModal.actions;
export const ChatModalReducer = ChatModal.reducer;
