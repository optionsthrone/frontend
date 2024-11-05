import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IGameSettings, IRoom } from "@/types/interfaces/room/room";

const gameSettings = {
  "Game Mode": "Classic",
  "Game Type": "Casual",
  "Starting Cash": "10000",
  "Max Players": 4,
  "Margin Maintenance": "On",
  "Max Contracts": 10000,
  "Max Shares": 1000000,
  "Naked Shorting": "Off",
  "Trading Phase Time Limit": 60,
  "Abilities Phase Time Limit": 15,
  Abilities: {
    Gaze: "On",
    Halt: "On",
    Reject: "On",
    Protect: "On",
    Dividend: "Off",
    "Price Action Down": "On",
    "Price Action Up": "On",
  },
};
const initialState: IRoom = {
  roomCode: "",
  hostUserName: "",
  playerCount: 1,
  roomType: "private",
  gameSettings,
  gameInProgress: false,
  playerData: {},
  chatLog: [],
  bannedPlayers: [],
  wasKicked: false,
};

const roomSlice = createSlice({
  name: "roomData",
  initialState,
  reducers: {
    setRoomState: (state, { payload }: PayloadAction<IRoom>) => {
      return payload;
    },
    changeRoom: (state) => {
      state.roomType = state.roomType === "private" ? "public" : "private";
    },
    setHostUsername: (state, { payload }: PayloadAction<string>) => {
      state.hostUserName = payload;
      Object.assign(state.playerData, {
        ...state.playerData,
        [payload]: { ...state.playerData[payload], readyState: "host" },
      });
    },
    setPlayerReady: (state, { payload }: PayloadAction<string>) => {
      Object.assign(state.playerData, {
        ...state.playerData,
        [payload]: { ...state.playerData[payload], readyState: "ready" },
      });
    },
    banPlayer: (state, { payload }: PayloadAction<string>) => {
      delete state.playerData[payload];
    },
    kickPlayer: (state, { payload }: PayloadAction<string>) => {
      delete state.playerData[payload];
    },
    updateSettings: (state, { payload }: PayloadAction<IGameSettings>) => {
      state.gameSettings = payload;
    },
    resetGameSettings: (state) => {
      state.gameSettings = gameSettings;
    },
    updateChatlog: (state, { payload }: PayloadAction<IChat>) => {
      state.chatLog.push(payload);
    },
  },
});

export const roomActions = roomSlice.actions;
export default roomSlice.reducer;
