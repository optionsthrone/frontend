import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "./store";

import { bindActionCreators } from "@reduxjs/toolkit";
import { accountModalActions } from "./services/modalServices/AccountModalSlice";
import { snackbarActions } from "./services/SnackBarSlice";
import { userAccountActions } from "./services/UserAccountSlice";
import { socketActions } from "./services/socketSlice";
import { roomActions } from "./services/roomSlice";
import { roomModalActions } from "./services/modalServices/roomModalSlice";
import { gameModalActions } from "./services/modalServices/gameModal";
import { gameActions } from "./services/gameSlice";
import { ChatModalActions } from "./services/modalServices/chatModal";
import { gamePlayActions } from "./services/gameActions";
import { activeEventModalActions } from "./services/modalServices/activeEvent";
import { gameStatusActions } from "./services/gameStatus";
import { endGameModalActions } from "./services/modalServices/endgameModal";
import { roomsInvalidateTags } from "./api/roomApi";
// import { socketInvalidateTags } from "./api/socketApi";
import { pingActions } from "./services/pingSlice";
import { chatMessagesActions } from "./services/chatActions";

export const actions = {
  ...accountModalActions,
  ...snackbarActions,
  ...userAccountActions,
  ...socketActions,
  ...roomActions,
  ...roomModalActions,
  ...gameModalActions,
  ...gameActions,
  ...ChatModalActions,
  ...gamePlayActions,
  ...activeEventModalActions,
  ...gameStatusActions,
  ...endGameModalActions,
  ...pingActions,
  ...chatMessagesActions,
  roomsInvalidateTags,
  // socketInvalidateTags,
};

// Use throughout of application instead of plain `useDispatch` and `useSelector`
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
