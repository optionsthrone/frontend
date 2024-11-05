import { CSSProperties } from "react";
import { IPositionLeg } from "../game/game";

export interface ISendData {
  action: string;
  payload: IPayload;
  queue?: boolean;
}

export interface IRoomCode {
  roomCode: string;
}

export interface IPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: any;
  roomCode: string;
  roomType?: string;
  currentPhase?: string;
  kickedPlayerUserName?: string;
  isBanned?: boolean;
  settings?: unknown;
  tradeRequest?: ITradeRequest;
  token?: string;
}
export interface ITradeRequest {
  corporation: string;
  primaryLeg: IPositionLeg;
  coveringLeg: IPositionLeg | null;
  buyingPower: number | null;
}

export interface IStyle {
  opacity: string | number;
  pointerEvents?: CSSProperties["pointerEvents"] | undefined;
}

export type IRooms = {
  roomCode: string;
  playerCount: number;
  hostUserName: string;
  gameSettings: IGameSettings;
};

export interface IRoom {
  gameSettings: IGameSettings;
  roomCode: string;
  hostUserName: string;
  chatLog: IChat[];
  playerData: {
    [x: string]: {
      readyState: string;
      userName: string;
    };
    // a: {
    //     ...;
    // };
  };
  gameInProgress: false;
  roomType: string;
  playerCount: number;
  bannedPlayers: [];
  wasKicked: false;
}
export interface IChat {
  userName: string;
  message: string;
  timestamp: string;
}

export type IGameSettings = {
  "Max Players": number;
  "Max Shares": number;
  Abilities: IAbilities;
  "Game Mode": string;
  "Game Type": string;
  "Starting Cash": number | string;
  "Max Contracts": number;
  "Margin Maintenance": string;
  "Naked Shorting": string;
  "Trading Phase Time Limit": number;
  "Abilities Phase Time Limit": number;
};

export interface IAbilities {
  [key: string]: string;
}
