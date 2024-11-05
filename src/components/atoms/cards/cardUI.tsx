import React, { useState, useCallback, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import {
  useSprings,
  animated,
  to as interpolate,
  Globals,
} from "@react-spring/web";
import ReactCardFlip from "react-card-flip";
import logo from "@/playground_assets/logos/main logo.png";
import "./styles.css";
import { ITextStyle } from "@/types/interfaces/card/card";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import Image from "next/image";

interface IDeck {
  deck?: number;
  showCardAnimation?: boolean;
  cardAnimation?: "flip";
  showDeckAnimation?: boolean;
  classes?: string;
  cardClass: string;
  frontText?: string[];
  backText?: string[];
  styles?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  frontImage?: string[];
  backImage?: string[];
  deckTop?: number;
  deckBottom?: number;
  deckRight?: number;
  deckLeft?: number;
  DisheveledX?: number | "auto";
  DisheveledY?: number | "auto";
  DisheveledZ?: number | "auto";
  draggable?: boolean;
  width?:
    | number
    | `${number}rem`
    | `${number}em`
    | `${number}px`
    | `${number}%`
    | `${number}vw`
    | `${number}vh`;
  textStyle?: ITextStyle;
}

const Deck = ({
  frontText,
  backText,
  deck,
  showCardAnimation,
  showDeckAnimation,
  styles,
  frontImage,
  backImage,
  classes,
  textStyle,
  // imageStyle,
  deckTop,
  deckBottom,
  deckRight,
  deckLeft,
  DisheveledX,
  DisheveledY,
  DisheveledZ,
  // width,
  // draggable,
  cardClass,
}: IDeck) => {
  const { width: windowWidth } = useWindowSizeContext();
  // const [drag, setDrag] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [isFlipped, setFlipped] = useState<boolean[]>(
    Array.from({ length: deck ?? 1 }, () => false)
  );

  const handleClick = useCallback(
    (i: number) => {
      if (!showCardAnimation) return;

      setFlipped((prevState) => {
        const newState = [...prevState];
        newState[i] = !newState[i];
        return newState;
      });
    },
    [showCardAnimation]
  );
  // skip animation
  useEffect(() => {
    Globals.assign({
      skipAnimation: true,
    });

    return () => {
      Globals.assign({
        skipAnimation: false,
      });
    };
  });

  useEffect(() => {
    if (showDeckAnimation) {
      handleShuffle();
    }
  }, [showDeckAnimation]);

  const handleShuffle = useCallback(() => {
    setShuffle(true);
    setTimeout(() => {
      setShuffle(false);
    }, 3000);
  }, []);
  // let count = 0;
  // let transX;
  // let transY;
  // const shuffleCards = () => {
  //   // play shuffle sound
  //   var audio = new Audio("/sounds/shuffle.mp3");
  //   audio.play();

  //   // disable drag
  //   setDrag(false);
  //   ++count;

  //   setTimeout(() => {
  //     if (count > 3) {
  //       count = 0;
  //       return;
  //     } else {
  //       shuffleCards();
  //     }
  //   }, 500);
  //   // let zIndex = numOfCards;
  //   let newState = [...isFlipped];
  //   let cards = Array.from(
  //     document.getElementsByClassName(`${cardClass}-card`)
  //   );
  //   /* shuffle */
  //   // cards.sort(function (a, b) {
  //   //   return 0.5 - Math.random();
  //   // });
  //   cards.forEach((card: any, index) => {
  //     card.style.zIndex = index;

  //     cards.length - index === 1
  //       ? (card.style["animation-delay"] = 40 + "ms")
  //       : (card.style["animation-delay"] =
  //           16.66 * (cards.length - index) + "ms");

  //     newState[index] = true;
  //     setFlipped(newState);
  //     transX =
  //       (deckLeft && deckRight) || (deckLeft === 0 && deckRight === 0)
  //         ? (-deckLeft + deckRight) * index
  //         : deckLeft || deckLeft === 0
  //         ? -deckLeft * index
  //         : deckRight || deckRight === 0
  //         ? deckRight * index
  //         : 0;
  //     (transY =
  //       (deckTop && deckBottom) || (deckTop === 0 && deckBottom === 0)
  //         ? (-deckTop + deckBottom) * index
  //         : deckTop || deckTop === 0
  //         ? -deckTop * index
  //         : deckBottom || deckBottom === 0
  //         ? deckBottom * index
  //         : index * -4),
  //       card.animate(
  //         [
  //           {
  //             transform: `translate3d(${transX}px,${transY}px,0px)`,
  //           },
  //           // key frames
  //           {
  //             transform: `translate3d(${transX * index * 0.043}px,${
  //               transY * index * 0.04
  //             }px,0px)`,
  //           },
  //           // key frames
  //           {
  //             transform: `translate3d(${transX * index * 0.067}px,${
  //               transY * index * 0.065
  //             }px,0px)`,
  //           },
  //           {
  //             transform: `translate3d(${transX * index * 0.04}px,${
  //               transY * index * 0.042
  //             }px,0px)`,
  //           },
  //           {
  //             transform: `translate3d(${transX * index * 0.062}px,${
  //               transY * index * 0.06
  //             }px,0px)`,
  //           },
  //           {
  //             transform: `translate3d(${transX * index * 0.032}px,${
  //               transY * index * 0.03
  //             }px,0px)`,
  //           },
  //           {
  //             transform: `translate3d(${transX}px,${transY}px,0px)`,
  //           },
  //         ],
  //         {
  //           // sync options
  //           duration: 3000,
  //           delay:
  //             cards.length - index !== 2
  //               ? 40 * cards.length - index
  //               : 40 * index,
  //         }
  //       );
  //   });
  // };
  const numOfCards = deck ?? 1;
  const trans = useCallback(
    (r: number, s: number) =>
      `perspective(1500px) rotateX(${
        DisheveledX === "auto" ? "30deg" : `${DisheveledX}deg`
      }) rotateY(${
        DisheveledY === "auto" ? `${r}deg` : `${DisheveledY}deg`
      }) rotateZ(${
        DisheveledZ === "auto" ? "0deg" : `${DisheveledZ}deg`
      }) scale(${s})`,
    [DisheveledX, DisheveledY, DisheveledZ]
  );

  const to = useCallback(
    (i: number) => ({
      x:
        (deckLeft && deckRight) || (deckLeft === 0 && deckRight === 0)
          ? (-deckLeft + deckRight) * i
          : deckLeft || deckLeft === 0
          ? -deckLeft * i
          : deckRight || deckRight === 0
          ? deckRight * i
          : 0,
      y:
        (deckTop && deckBottom) || (deckTop === 0 && deckBottom === 0)
          ? (-deckTop + deckBottom) * i
          : deckTop || deckTop === 0
          ? -deckTop * i
          : deckBottom || deckBottom === 0
          ? deckBottom * i
          : i * -4,
      scale: 1,
      rot: -10 + Math.random() * 20,
      delay: i * 100,
      z: 0,
    }),

    [deckLeft, deckRight, deckTop, deckBottom]
  );

  // const from = useCallback(
  //   (_i: number) => ({
  //     x: 0,
  //     y:
  //       (deckTop && deckBottom) || (deckTop === 0 && deckBottom === 0)
  //         ? (-deckTop + deckBottom) * _i
  //         : deckTop || deckTop === 0
  //         ? -deckTop * _i
  //         : deckBottom || deckBottom === 0
  //         ? deckBottom * _i
  //         : _i * 4,
  //     scale: 1,
  //     rot: 0,
  //     z: 0,
  //   }),
  //   [deckLeft, deckRight, deckTop, deckBottom]
  // );

  const [props, api] = useSprings(
    numOfCards,
    (i) => ({
      ...to(i),
      from: to(i),
      immediate: true,
    }),
    [deckLeft, deckRight, deckTop, deckBottom]
  );

  const bind = useDrag(({ args: [index], down, movement: [mx, my] }) => {
    const xdir = mx < 0 ? -1 : 1;
    // const ydir = my < 0 ? -1 : 1;

    api.start((i) => {
      if (index !== i) return;

      const isGone = down && mx ** 2 + my ** 2 > (windowWidth / 2) ** 2;

      return {
        // x: isGone ? (200 + window.innerWidth) * xdir : down ? mx : 0,
        // y: isGone ? (200 + window.innerHeight) * ydir : down ? my : 0,
        immediate: true,
        // immediate: down,
        scale: down ? 1.1 : 1,
        rot: mx / 100 + (isGone ? xdir * 10 * Math.random() : 0),
        config: {
          friction: 50,
          tension: down ? 800 : isGone ? 200 : 500,
          duration: 0,
        },
      };
    });
  });

  return (
    <>
      {props.map(({ x, y, z, rot, scale }, i) => (
        <animated.div
          key={i}
          style={{
            transform: interpolate(
              [x, y, z],
              (x, y, z) => `translate3d(${x}px,${y}px,${z}px)`
            ),
          }}
          className={`${cardClass}-card card-${i + 1}   callit_card`}
          onClick={() => handleClick(i)}
        >
          <ReactCardFlip isFlipped={isFlipped[i]} flipDirection="vertical">
            <div>
              <animated.div
                {...bind(i)}
                style={{
                  ...styles,
                  backgroundImage: `url(${
                    frontImage && frontImage[i] ? frontImage[i] : ""
                  })`,
                  transform: interpolate([rot, scale], trans),
                }}
                className={`${classes} front`}
              >
                {shuffle ? <Image src={logo} alt="image" /> : ""}
                <div
                  className="card_text"
                  style={{
                    fontSize: frontText
                      ? `${
                          (frontText[i] ? 1 / frontText[i].length : 0.1) * 4 +
                          0.2
                        }rem`
                      : 100,
                    ...{
                      fontStyle: textStyle?.fontStyle,
                      fontWeight: textStyle?.fontWeight,
                      lineHeight: textStyle?.lineHeight,
                      textAlign: textStyle?.textAlign,
                      textDecorationLine: textStyle?.textDecorationLine,
                      textTransform: textStyle?.textTransform,
                      fontVariant: textStyle?.fontVariant,
                      letterSpacing: textStyle?.letterSpacing,
                      textDecorationStyle: textStyle?.textDecorationStyle,
                      writingDirection: textStyle?.writingDirection,
                    },
                  }}
                >
                  {frontText && frontText[i] ? frontText[i] : " "}
                </div>
              </animated.div>
            </div>

            <div>
              <animated.div
                {...bind(i)}
                style={{
                  ...styles,
                  backgroundImage: `url("${
                    backImage && backImage[i] ? backImage[i] : ""
                  }")`,
                  transform: interpolate([rot, scale], trans),
                }}
                className={`${classes} back`}
              >
                {shuffle ? <Image src={logo} alt="image" /> : ""}
                <div
                  className="card_text"
                  style={{
                    fontSize: backText
                      ? `${
                          (backText[i] ? 1 / backText[i].length : 0.1) * 4 + 0.2
                        }rem`
                      : 100,
                    ...{
                      fontStyle: textStyle?.fontStyle,
                      fontWeight: textStyle?.fontWeight,
                      lineHeight: textStyle?.lineHeight,
                      textAlign: textStyle?.textAlign,
                      textDecorationLine: textStyle?.textDecorationLine,
                      textTransform: textStyle?.textTransform,
                      fontVariant: textStyle?.fontVariant,
                      letterSpacing: textStyle?.letterSpacing,
                      textDecorationStyle: textStyle?.textDecorationStyle,
                      writingDirection: textStyle?.writingDirection,
                    },
                  }}
                >
                  {backText && backText[i] ? backText[i] : " "}
                </div>
              </animated.div>
            </div>
          </ReactCardFlip>
        </animated.div>
      ))}
    </>
  );
};
Deck.displayName = "Deck";
export default Deck;
