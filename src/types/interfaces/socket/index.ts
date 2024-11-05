import { IRoom } from "../room/room";

export interface IsocketData {
  isSocket: boolean;
  receivedData: IReceivedData | null;
  isWebSocketErrorResponse: boolean;
  webSocketErrorResponse: string | null;
  isConnected: boolean;
  actionPending: string | null;
}

export interface IReceivedData {
  type: string;
  roomCode?: string;
  message: string;
  dataType: string;
  data?: IRoom;
  updatedByUserName: string;
  updatedByAction: string;
}
