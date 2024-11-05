import React, { useEffect, useRef } from "react";
import { useActions } from "@/store/hooks";
import { IActiveEvents } from "@/types/interfaces/boardPiece/boardpiece";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});
const ActiveEvents = ({ action, name, text }: IActiveEvents) => {
  const { openActiveEventModal } = useActions();
  const { width } = useWindowSizeContext();

  const cardTextRef = useRef<HTMLParagraphElement>(null);
  // function adjustFontSize() {
  //   if (!cardTextRef.current) {
  //     return;
  //   }
  //   let fontSize = 16; // Starting font size
  //   const containerWidth = cardTextRef.current.offsetWidth;
  //   const containerHeight = cardTextRef.current.offsetHeight;

  //   cardTextRef.current.style.fontSize = `${fontSize}px`;

  //   while (
  //     cardTextRef.current.scrollWidth > containerWidth ||
  //     cardTextRef.current.scrollHeight > containerHeight
  //   ) {
  //     fontSize--;
  //     cardTextRef.current.style.fontSize = `${fontSize}px`;
  //   }
  // }

  // useEffect(() => {
  //   adjustFontSize();
  // }, [text]);

  // const cardTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeText = () => {
      if (!cardTextRef.current) {
        return;
      }

      let fontSize = 1.8;
      cardTextRef.current.style.fontSize = `${fontSize}vh`;

      while (
        cardTextRef.current &&
        (cardTextRef.current.scrollWidth > cardTextRef.current.offsetWidth ||
          cardTextRef.current.scrollHeight > cardTextRef.current.offsetHeight)
      ) {
        fontSize -= 0.05;

        cardTextRef.current.style.fontSize = `${fontSize}vh`;
        if (fontSize <= 0.12) {
          break;
        }
      }
    };

    resizeText();
  }, [text, width]);
  // console.log(text.length);

  return (
    action && (
      <div
        className={`${roboto.className} activeEvent pointer`}
        onClick={() => {
          openActiveEventModal();
        }}
      >
        <div ref={cardTextRef} className="activeEvent_child">
          <div>
            <h1
              className="card-header"
              // style={{
              //   fontSize: `${
              //     (text.length < 90 ? 15 / text.length : 0.1) * text.length * 8
              //   }%`,
              // }}
            >
              {name.split(" | ")[0]}
            </h1>
            <p
              className="text-right card-action"
              // style={{
              //   fontSize: `${
              //     (text.length < 90 ? 15 / text.length : 0.1) * text.length * 7
              //   }%`,
              // }}
            >
              {name.split(" | ")[1]}
            </p>
          </div>
          {/* <div className="card-header">
          <h1 className="card-name">{name.split(" | ")[0]}</h1>
          {name.split(" | ").length > 1 && (
            <h2 className="card-action">{name.split(" | ")[1]}</h2>
          )}
        </div> */}
          {/* <h1>{text}</h1> */}
          <p
            className="card-text"
            // style={{
            //   fontSize: `${
            //     (((text.length < 90 ? 15 / text.length : 0.09) * text.length) /
            //       18) *
            //     0.8
            //   }vw`,
            // }}
            // style={{ visibility: isLoaded ? "visible" : "hidden" }}
          >
            {text}
          </p>{" "}
        </div>
      </div>
    )
  );
};

export default ActiveEvents;
