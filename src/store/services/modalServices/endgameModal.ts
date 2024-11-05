import { createSlice } from "@reduxjs/toolkit";
interface IEndGameModalProps {
  isOpen: boolean;
}

const initialState: IEndGameModalProps = {
  isOpen: false,
};

const endGameModal = createSlice({
  name: "endGameModal",
  initialState,
  reducers: {
    closeEndGameModal: (state) => {
      state.isOpen = false;
    },
    openEndGameModal: (state) => {
      state.isOpen = true;
    },
  },
});

export const endGameModalActions = endGameModal.actions;
export const endGameModalReducer = endGameModal.reducer;
