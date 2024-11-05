import { IPositionLeg } from "../interfaces/game/game";

export type ITradeForm = {
  corporation: string;
  primaryLeg: IPositionLeg;
  coveringLeg: IPositionLeg | null;
  primaryLegPrice: number;
  coveringLegPrice: number;
  payment: number;
  buyingPower: number;
  cashEffect: number;
};
