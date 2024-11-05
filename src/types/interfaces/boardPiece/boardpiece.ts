import { Size } from "../card/card";
import { IGameAbilites } from "../game/game";

export interface ITrendChart {
  height: Size;
  number: number;
  marginBottom: Size;
}

export interface ICorporationBlock {
  corpName: string;
  rotate: number;
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
  rotatingCoefficient: number;
  className?: string;
  CardBgColor?: string;
  CardTextColor?: string;
  bgImage?: string;
  priceTracker: string;
  price: number;
  children?: JSX.Element;
  activeEvents?: IActiveEvents;
  abilityStatus: IGameAbilites;
  onDoubleClick: () => void;
}

export interface IActiveEvents {
  action: string;
  name: string;
  text: string;
  back?: string;
}
