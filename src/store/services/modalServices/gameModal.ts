import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface IGameModalProps {
  isOpen: boolean;
  isOptionModalOpen: boolean;
  modalType: "trade" | "ability" | "game settings" | "open trades";
  optionModalType: "option";
}

const initialState: IGameModalProps = {
  isOpen: false,
  isOptionModalOpen: false,
  modalType: "trade",
  optionModalType: "option",
};

const gameModal = createSlice({
  name: "game",
  initialState,
  reducers: {
    closeGameModal: (state) => {
      state.isOpen = false;
    },
    openGameModal: (
      state,
      action: PayloadAction<
        "trade" | "ability" | "game settings" | "open trades"
      >
    ) => ({
      ...state,
      isOpen: true,
      modalType: action.payload,
    }),
    closeOptionModal: (state) => {
      state.isOptionModalOpen = false;
    },
    openOptionPriceModal: (state, action: PayloadAction<"option">) => ({
      ...state,
      isOptionModalOpen: true,
      optionModalType: action.payload,
    }),
  },
});

export const gameModalActions = gameModal.actions;
export const gameModalReducer = gameModal.reducer;
