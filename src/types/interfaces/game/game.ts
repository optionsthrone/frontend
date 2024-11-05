import { IChat, IGameSettings } from "../room/room";
import { IActiveEvents } from "../boardPiece/boardpiece";

export enum GameFilterType {
  GameMode = "gameMode",
  GameType = "gameType",
}

export interface IGameStatus {
  type: string;
  message: string;
}

export interface IGameState {
  data: IGame;
  dataType: string;
  type: string;
  updatedByAction: string;
  updatedByUserName: string;
}

export interface IGame {
  roomCode: string;
  diceRoll: null | "none" | "BGBO" | "MGCR" | "CBRT" | "Global" | "EDSC";
  currentPlayer: string;
  chatLog: IChat[];
  playerData: IPlayerData;
  gameLog: string[];
  activeEvents: {
    BGBO: ICurrency;
    MGCR: ICurrency;
    CBRT: ICurrency;
    Global: ICurrency;
    EDSC: ICurrency;
  };
  corporations: ICorporation;
  turnOrder: string[];
  gameSettings: IGameSettings;
  currentTurn: number;
  currentPhase: string;
  phaseStartTimestamp?: string;
  phaseEndTimestamp?: string;
}

export interface IPlayerData {
  [x: string]: {
    cash: number;
    positions: IPosition[];
    actionsPerformed?: boolean;
    afkStreak?: number;
    isAbilitySelected?: boolean;
    userName: string;
  };
}
export interface IPosition {
  buyingPower: number;
  corporation: string;
  primaryLeg: IPositionLeg;
  coveringLeg: null | IPositionLeg;
}

export interface IPositionLeg {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key?: any;
  type: string;
  direction: string;
  margin: boolean;
  quantity: number;
  strike?: number | null;
  expiry?: number | null;

  price?: number;
}

export interface ICurrency {
  abilities: {
    Gaze: {
      extraData: { card: IActiveEvents };
    };
  };
  cards: {
    [x: string]: IActiveEvents;
  };
}

export interface ICardsRemaining {
  name: string;
  action: string;
  back: null;
  text: string;
}

export interface ICorporation {
  [x: string]: ICorporationType;
  // BGBO: ICorporationType;
  // MGCR: ICorporationType;
  // CBRT: ICorporationType;
  // Global: ICorporationType;
  // EDSC: ICorporationType;
}

export interface ICorporationType {
  abilities: IGameAbilites;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardsDrawn: any[];
  price: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | number;
  cardsRemaining: ICardRemaining[];
}

export interface IGameAbilites {
  [x: string]: IGameAbilityType;
}

export interface IGameAbilityType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData: any;
  status: string;
}

export interface ICardRemaining {
  name: string;
  action: string;
  back?: string;
  text: string;
}

export interface IAbilitesDesc {
  [x: string]: string;
}

export interface IAbilitesImage {
  [x: string]: string;
}

export interface IAdjust {
  displayPositionIndex: number;
  adjust: {
    position: IPosition;
    tradeType: string;
  };
}
