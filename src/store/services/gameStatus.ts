import { IGameStatus } from "@/types/interfaces/game/game";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IGameStatus = {
    type: "",
    message: ""
};

const gameStatusSlice = createSlice({
    name: "gameStatusSlice",
    initialState,
    reducers: {
        setGameStatus: (state, { payload }: PayloadAction<IGameStatus>) => {
            return payload;
        }
    }
});

export const gameStatusActions = gameStatusSlice.actions;
export const gameStatusReducer = gameStatusSlice.reducer;
