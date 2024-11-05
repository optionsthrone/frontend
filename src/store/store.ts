import { configureStore } from "@reduxjs/toolkit";
import { accountModalReducer } from "./services/modalServices/AccountModalSlice";
import { accountApi } from "./api/accountApi";
import { snackbarReducer } from "./services/SnackBarSlice";
import { userAccountReducer } from "./services/UserAccountSlice";
import socketReducer from "./services/socketSlice";
import { roomApi } from "./api/roomApi";
import { socketsApi } from "./api/socketApi";
import roomReducer from "./services/roomSlice";
import { roomModalReducer } from "./services/modalServices/roomModalSlice";
import { gameModalReducer } from "./services/modalServices/gameModal";
import gameReducer from "./services/gameSlice";
import { ChatModalReducer } from "./services/modalServices/chatModal";
import gamePlayReducer from "./services/gameActions";
import { activeEventModalReducer } from "./services/modalServices/activeEvent";
import { gameStatusReducer } from "./services/gameStatus";
import { endGameModalReducer } from "./services/modalServices/endgameModal";
import chatMessagesReducer from "./services/chatActions";
import pingReducer from "./services/pingSlice";

export const store = () =>
  configureStore({
    reducer: {
      [accountApi.reducerPath]: accountApi.reducer,
      [roomApi.reducerPath]: roomApi.reducer,
      [socketsApi.reducerPath]: socketsApi.reducer,
      accountModal: accountModalReducer,
      snackbar: snackbarReducer,
      userInfo: userAccountReducer,
      socket: socketReducer,
      room: roomReducer,
      roomModal: roomModalReducer,
      gameModal: gameModalReducer,
      game: gameReducer,
      chatModal: ChatModalReducer,
      gamePlay: gamePlayReducer,
      gameStatus: gameStatusReducer,
      activeEvent: activeEventModalReducer,
      endGameModal: endGameModalReducer,
      chatMessages: chatMessagesReducer,
      ping: pingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        accountApi.middleware,
        roomApi.middleware,
        socketsApi.middleware,
      ]),
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
