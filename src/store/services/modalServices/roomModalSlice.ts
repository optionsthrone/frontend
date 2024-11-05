import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IRoomModalProps {
  isOpen: boolean;
  isSettingsOpen: boolean;
  modalType:
    | "settings"
    | "help"
    | "kickPlayer"
    | "chat"
    | "settingsHelp"
    | "not all ready";
  playerToKick: string;
}

const initialState: IRoomModalProps = {
  isOpen: false,
  modalType: "settings",
  isSettingsOpen: false,
  playerToKick: "",
};

const roomModalSlice = createSlice({
  name: "roomModal",
  initialState,
  reducers: {
    closeRoomModal: (state) => {
      state.isOpen = false;
    },
    closeSettingsHelpModal: (state) => ({
      ...state,
      isSettingsOpen: false,
      isOpen: true,
      modalType: "settings",
    }),
    openRoomModal: (
      state,
      action: PayloadAction<
        | "settings"
        | "help"
        | "kickPlayer"
        | "chat"
        | "settingsHelp"
        | "not all ready"
      >
    ) => ({
      ...initialState,
      isOpen: true,
      modalType: action.payload,
      isSettingsOpen: action.payload === "settingsHelp" ? true : false,
    }),
    setPlayerToKick: (state, { payload }) => {
      state.playerToKick = payload;
    },
  },
});

export const roomModalActions = roomModalSlice.actions;
export const roomModalReducer = roomModalSlice.reducer;
