"use client";

import React, { useState, useEffect } from "react";
import { ICardProps } from "@/types/interfaces/card/card";
import Deck from "./cardUI";
import className from "classnames";

function Card({
  shape,
  height,
  deck,
  width,
  frontImage,
  backImage,
  showCardAnimation,
  showDeckAnimation,
  styles,
  backGroundColor,
  textColor,
  frontText,
  backText,
  fontSize,
  textStyle,
  imageStyle,
  deckTop,
  deckBottom,
  deckRight,
  deckLeft,
  DisheveledX,
  DisheveledY,
  DisheveledZ,
  draggable,

  classes: classNames,
}: ICardProps) {
  const [cardID, setCardID] = useState<undefined | string>();
  const classes = className(` card ${classNames}`, {
    circle: shape === "circle",
    hexagon: shape === "hexagon",
    rectangle: shape == "rectangle" || !shape,
    square: shape === "square",
    //  "border-red-500 bg-red-500 text-white": danger,
    //  "rounded-md": rounded,
    //  "rounded-3xl": BorderRadius,
    //  "bg-white": outline,
    //  "text-blue-500": outline && primary,
    //  "text-red-900": outline && secondary,
    //  "text-green-500": outline && success,
    //  "text-yellow-500": outline && warning,
    //  "text-red-500": outline && danger,
  });

  const defaultWidth = "3rem";
  const defaultHeight = "5rem";
  function makeid() {
    const length = 8;
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    const id = makeid();
    setCardID(id);
  }, []);
  if (!cardID) return;
  const cardStyles = `
        .${cardID} {
          position: relative;
          overflow: hidden;
          display: flex;
          width: ${
            !width
              ? defaultWidth
              : typeof width === "number"
              ? width + "px"
              : width
          };
          height: ${
            shape == "square" || "circle" || "hexagon"
              ? typeof width === "number"
                ? width + "px"
                : width
              : typeof height === "number"
              ? height + "px"
              : height
          };
          cursor: default;
          overflow: visible;
          justify-content: center;
        }

        .${cardID} > div {
          position: absolute;
          width: 100%;
          height: 100%;
          will-change: transform;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card_text {
          word-break: break-word;
        }
        .${cardID} .card {
          background-color: ${backGroundColor ? backGroundColor : " "};
          background-repeat: no-repeat;
          background-position: center center; 
          // transition: transform 0.3s ease-in-out;
          color: ${textColor};
          font-size: ${
            !fontSize
              ? "5%"
              : typeof fontSize === "number"
              ? fontSize + "px"
              : fontSize
          };
          max-width: 100%;
          display: flex;
          height: ${
            shape == "square" || "circle" || "hexagon"
              ? typeof width === "number"
                ? width + "px"
                : width
              : typeof height === "number"
              ? height + "px"
              : height
          };
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0.4rem;
          max-height: 100%;
          will-change: transform;
          // box-shadow: 0px 0.01rem 0.2rem rgba(0, 0, 0, 0.2);
          box-shadow: 0px 0px 1px rgba(0,0,0,.5);
        }
        .${cardID} > div > div img {
          width: 100%;
          max-width: ${typeof width === "number" ? width + "px" : width};
           
          height: 85%;
        }

       .${cardID} .front,
        .back {
          background-size: cover;
        }

        .${cardID} .rectangle {
          aspect-ratio: 0.5;
          width: ${
            !width
              ? defaultWidth
              : typeof width === "number"
              ? width + "px"
              : width
          };
          height: ${
            !height
              ? defaultHeight
              : typeof height === "number"
              ? height + "px"
              : height
          }; 
        }
       .${cardID} .square {
          width: ${
            !width
              ? defaultWidth
              : typeof width === "number"
              ? width + "px"
              : width
          };
          height: ${
            !width
              ? defaultWidth
              : typeof width === "number"
              ? width + "px"
              : width
          }; 
        }
       .${cardID} .hexagon {
          width: ${
            !width
              ? defaultWidth
              : typeof width === "number"
              ? width + "px"
              : width
          };
          height: ${
            !height
              ? defaultHeight
              : typeof height === "number"
              ? height + "px"
              : height
          };
          display: grid;
          place-content: center;
          place-items: center;
          aspect-ratio: 1 / cos(30deg);
          clip-path: polygon(50% -50%, 100% 50%, 50% 150%, 0 50%);
        }
       .${cardID} .circle {
          width: ${
            !width
              ? defaultWidth
              : typeof width === "number"
              ? width + "px"
              : width
          };
          height: ${
            !height
              ? typeof width === "number"
                ? width + "px"
                : width
              : typeof height === "number"
              ? height + "px"
              : height
          };
          background-color: #bbb;
          border-radius: 50% !important;
          display: inline-block;
        }
      `;
  return (
    <>
      <div className={`${cardID} ${classNames}`} style={{ ...styles }}>
        <style>{cardStyles}</style>
        <Deck
          cardClass={cardID}
          deck={deck}
          showCardAnimation={showCardAnimation}
          showDeckAnimation={showDeckAnimation}
          classes={classes}
          styles={styles}
          frontText={frontText}
          backText={backText}
          imageStyle={imageStyle}
          textStyle={textStyle}
          frontImage={frontImage}
          backImage={backImage}
          deckTop={deckTop}
          deckBottom={deckBottom}
          deckRight={deckRight}
          deckLeft={deckLeft}
          DisheveledX={DisheveledX}
          DisheveledY={DisheveledY}
          DisheveledZ={DisheveledZ}
          width={width}
          draggable={draggable}
        />
      </div>
    </>
  );
}

// Card.propTypes = {
//   checkVariationValue: ({
//     shape,
//     height,
//     deck,
//     width,
//     frontImage,
//     backImage,
//     showCardAnimation,
//     showDeckAnimation,
//     styles,
//     imageStyle,
//     draggable,
//   }: ICardProps) => {
//     if (shape === "square" && width !== height) {
//       return new Error("Use a Rectangle instead.");
//     }
//     if (shape === "rectangle" && !width && !height) {
//       return new Error("A height and width need to be provided.");
//     }
//     if (!shape) {
//       return;
//     }
//   },
// };

export default Card;
