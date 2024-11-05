export type Size =
  | number
  | `${number}rem`
  | `${number}em`
  | `${number}px`
  | `${number}%`
  | `${number}vw`
  | `${number}vh`;

interface BaseShape {
  width?: Size;
}

interface SquareOrHexagon extends BaseShape {
  shape?: "square" | "hexagon";
  height?: never;
}

interface CircleOrRectangle extends BaseShape {
  shape?: "circle" | "rectangle";
  height: Size;
}

type ShapeProps = SquareOrHexagon | CircleOrRectangle;

export interface ITextStyle {
  fontFamily?: string | "initial" | "inherit";
  fontStyle?: "italic" | "normal" | "oblique" | "initial" | "inherit";
  fontWeight?:
    | "normal"
    | "bold"
    | "bolder"
    | "lighter"
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;
  lineHeight?: Size;
  textAlign?: "left" | "right" | "initial" | "inherit" | "center" | "justify";
  textDecorationLine?:
    | "initial"
    | "inherit"
    | "none"
    | "underline"
    | "overline"
    | "line-through";
  textTransform?:
    | "initial"
    | "inherit"
    | "uppercase"
    | "lowercase"
    | "none"
    | "capitalize";
  fontVariant?: "initial" | "inherit" | "normal" | "small-caps";
  letterSpacing?: "normal" | Size | "initial" | "inherit";
  textDecorationStyle?:
    | "solid"
    | "double"
    | "dotted"
    | "dashed"
    | "wavy"
    | "-moz-initial"
    | "inherit";
  writingDirection?: "ltr" | "rtl" | "initial" | "inherit";
}
type OtherProps = {
  deck?: number;
  frontImage?: string[];
  backImage?: string[];
  deckTop?: number;
  deckBottom?: number;
  deckRight?: number;
  deckLeft?: number;
  DisheveledX?: number | "auto";
  DisheveledY?: number | "auto";
  DisheveledZ?: number | "auto";
  showCardAnimation?: boolean;
  showDeckAnimation?: boolean;
  cardAnimation?: "flip";
  deckAnimation?: "shuffle";
  classes?: string;
  draggable?: boolean;
  backGroundColor?: string;
  textColor?: string;
  frontText?: string[];
  backText?: string[];
  fontSize?: Size;
  textStyle?: ITextStyle;
  imageStyle?: React.CSSProperties;
  styles?: React.CSSProperties;
};

export type ICardProps = ShapeProps & OtherProps;
