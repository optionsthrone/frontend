import { createSlice } from "@reduxjs/toolkit";
interface IActiveEventProps {
  isOpen: boolean;
}

const initialState: IActiveEventProps = {
  isOpen: false,
};

const ActiveEventModal = createSlice({
  name: "ActiveEvent",
  initialState,
  reducers: {
    closeActiveEventModal: (state) => {
      state.isOpen = false;
    },
    openActiveEventModal: (state) => {
      state.isOpen = true;
    },
  },
});

export const activeEventModalActions = ActiveEventModal.actions;
export const activeEventModalReducer = ActiveEventModal.reducer;
