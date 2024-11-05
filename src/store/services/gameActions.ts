import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdjust } from "@/types/interfaces/game/game";

const initialState: IAdjust = {
  displayPositionIndex: 0,
  adjust: {
    position: {
      buyingPower: 0,
      corporation: "",
      coveringLeg: null,
      primaryLeg: {
        direction: "",
        expiry: null,
        margin: false,
        quantity: 1,
        strike: 50,
        type: "",
        price: 0,
      },
    },
    tradeType: "",
  },
};
const gameActions = createSlice({
  name: "gameActions",
  initialState,
  reducers: {
    setDisplayPositionIndex: (state, { payload }: PayloadAction<number>) => {
      state.displayPositionIndex = payload;
    },
    setAdjust: (state, { payload }) => {
      state.adjust = payload;
    },
  },
});

export const gamePlayActions = gameActions.actions;
export default gameActions.reducer;
