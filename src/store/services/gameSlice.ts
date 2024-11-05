import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGameState } from "@/types/interfaces/game/game";

const initialState: IGameState = {
  data: {
    roomCode: "",
    currentPlayer: "",
    chatLog: [],
    playerData: {},
    gameLog: [""],
    activeEvents: {
      BGBO: {
        abilities: {
          Gaze: {
            extraData: {
              card: {
                action: "",
                name: "",
                text: "",
                back: "",
              },
            },
          },
        },
        cards: {},
      },
      MGCR: {
        abilities: {
          Gaze: {
            extraData: {
              card: {
                action: "",
                name: "",
                text: "",
                back: "",
              },
            },
          },
        },
        cards: {},
      },
      CBRT: {
        abilities: {
          Gaze: {
            extraData: {
              card: {
                action: "",
                name: "",
                text: "",
                back: "",
              },
            },
          },
        },
        cards: {},
      },
      Global: {
        abilities: {
          Gaze: {
            extraData: {
              card: {
                action: "",
                name: "",
                text: "",
                back: "",
              },
            },
          },
        },
        cards: {},
      },
      EDSC: {
        abilities: {
          Gaze: {
            extraData: {
              card: {
                action: "",
                name: "",
                text: "",
                back: "",
              },
            },
          },
        },
        cards: {},
      },
    },
    diceRoll: "none",
    corporations: {
      BGBO: {
        abilities: {
          Reject: {
            extraData: {},
            status: "",
          },
          "Price Action Down": {
            extraData: {},
            status: "",
          },
          "Price Action Up": {
            extraData: {},
            status: "",
          },
          Protect: {
            extraData: {},
            status: "",
          },
          Halt: {
            extraData: {},
            status: "",
          },
          Gaze: {
            extraData: {},
            status: "",
          },
          Dividend: {
            extraData: {},
            status: "",
          },
        },
        cardsDrawn: [],
        price: 20,
        cardsRemaining: [
          {
            name: "",
            action: "",
            text: "",
          },
        ],
      },
      MGCR: {
        abilities: {
          Reject: {
            extraData: {},
            status: "",
          },
          "Price Action Down": {
            extraData: {},
            status: "",
          },
          "Price Action Up": {
            extraData: {},
            status: "",
          },
          Protect: {
            extraData: {},
            status: "",
          },
          Halt: {
            extraData: {},
            status: "",
          },
          Gaze: {
            extraData: {},
            status: "",
          },
          Dividend: {
            extraData: {},
            status: "",
          },
        },
        cardsDrawn: [],
        price: 20,
        cardsRemaining: [
          {
            name: "",
            action: "",
            text: "",
          },
        ],
      },
      CBRT: {
        abilities: {
          Reject: {
            extraData: {},
            status: "",
          },
          "Price Action Down": {
            extraData: {},
            status: "",
          },
          "Price Action Up": {
            extraData: {},
            status: "",
          },
          Protect: {
            extraData: {},
            status: "",
          },
          Halt: {
            extraData: {},
            status: "",
          },
          Gaze: {
            extraData: {},
            status: "",
          },
          Dividend: {
            extraData: {},
            status: "",
          },
        },
        cardsDrawn: [],
        price: 20,
        cardsRemaining: [
          {
            name: "",
            action: "",
            text: "",
          },
        ],
      },
      Global: {
        abilities: {
          Reject: {
            extraData: {},
            status: "",
          },
          "Price Action Down": {
            extraData: {},
            status: "",
          },
          "Price Action Up": {
            extraData: {},
            status: "",
          },
          Protect: {
            extraData: {},
            status: "",
          },
          Halt: {
            extraData: {},
            status: "",
          },
          Gaze: {
            extraData: {},
            status: "",
          },
          Dividend: {
            extraData: {},
            status: "",
          },
        },
        cardsDrawn: [],
        price: 20,
        cardsRemaining: [
          {
            name: "",
            action: "",
            text: "",
          },
        ],
      },
      EDSC: {
        abilities: {
          Reject: {
            extraData: {},
            status: "",
          },
          "Price Action Down": {
            extraData: {},
            status: "",
          },
          "Price Action Up": {
            extraData: {},
            status: "",
          },
          Protect: {
            extraData: {},
            status: "",
          },
          Halt: {
            extraData: {},
            status: "",
          },
          Gaze: {
            extraData: {},
            status: "",
          },
          Dividend: {
            extraData: {},
            status: "",
          },
        },
        cardsDrawn: [],
        price: 20,
        cardsRemaining: [
          {
            name: "",
            action: "",
            text: "",
          },
        ],
      },
    },
    turnOrder: [""],
    gameSettings: {
      "Max Players": 4,
      "Max Shares": 1000000,
      Abilities: {
        Reject: "On",
        "Price Action Down": "On",
        "Price Action Up": "On",
        Protect: "On",
        Halt: "On",
        Gaze: "On",
        Dividend: "On",
      },
      "Game Mode": "Classic",
      "Game Type": "Casual",
      "Starting Cash": 10000,
      "Max Contracts": 10000,
      "Margin Maintenance": "On",
      "Naked Shorting": "Off",
      "Trading Phase Time Limit": 60,
      "Abilities Phase Time Limit": 15,
    },
    currentTurn: 0,
    currentPhase: "",
    phaseStartTimestamp: "",
    phaseEndTimestamp: "",
  },
  dataType: "",
  type: "",
  updatedByAction: "",
  updatedByUserName: "",
};

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setGameState: (state, { payload }: PayloadAction<IGameState>) => {
      // if (payload.updatedByAction === "ability") {
      //   return {
      //     ...state,
      //     data: {
      //       ...state.data,
      //       playerData: {
      //         ...state.data.playerData,
      //         [payload.updatedByUserName]: {
      //           ...state.data.playerData[payload.updatedByUserName],
      //           ...payload.data.playerData[payload.updatedByUserName],
      //           isAbilitySelected: true,
      //         },
      //       },
      //     },
      //   };
      // } else {
      //   return {
      //     ...state,
      //     ...payload,
      //   };
      // }
      return payload;
    },
    setPlayerAbilitySelected: (state, { payload }: PayloadAction<string>) => {
      Object.assign(state.data.playerData, {
        [payload]: {
          ...state.data.playerData[payload],
          isAbilitySelected: true,
        },
      });
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
