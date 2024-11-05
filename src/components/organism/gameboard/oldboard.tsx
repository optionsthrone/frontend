"use client";
import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  createUseGesture,
  dragAction,
  pinchAction,
  wheelAction,
} from "@use-gesture/react";

// import "./board.css";
import "./randomWave.css";
import CorporationLadder from "./corporationLadder";
import { useAppSelector } from "@/store/hooks";
// import styles from "./styles.module.css";
import Spiral from "./spiral";
// import Card from "@/components/atoms/cards/card";
import CardModal from "./activeEventsModal";
import ActiveEvents from "./activeEvents";
import { LuArrowBigRight, LuArrowBigLeft } from "react-icons/lu";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import Card from "@/components/atoms/cards/card";

const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);
function GameBoard() {
  const { width } = useWindowSizeContext();
  // board animate ref
  const board = React.useRef<HTMLDivElement>(null);
  // get game info from the store
  const { corporations, activeEvents, currentTurn } = useAppSelector(
    (state) => state.game.data
  );
  // reference board div
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  // get rotating coeefficients
  const [rotatingCoefficient, setRotatingCoefficient] = useState(
    width > 640 ? 0 : -90
  );

  // turn string to array to populate the image array
  function duplicateArray(str: string, n: number) {
    return Array(n).fill(str);
  }

  useEffect(() => {
    if (width > 640) {
      setRotatingCoefficient(0);
    } else {
      setRotatingCoefficient(-90);
    }
  }, [width]);

  /**
   * Determines the quadrant based on the given number and screen width.
   * @param number - The number to check.
   * @param width - The screen width.
   * @returns The quadrant number.
   */
  function checkQuadrant(number: number): number {
    const numberSign = Math.sign(number);
    const suffix = number.toString().split(".").pop() as string;
    const isInteger = Number.isInteger(number);

    const quadrantMap: Record<string, Record<string, number>> = {
      "1": { "25": 1, "5": 2, "75": 3, integer: 4 },
      "-1": { "25": 3, "5": 2, "75": 1, integer: 4 },
    };

    const smallScreenMap: Record<string, Record<string, number>> = {
      "1": { "25": 2, "5": 3, "75": 4, integer: 2 },
      "-1": { "25": 4, "5": 2, "75": 1, integer: 3 },
    };

    const map = width > 640 ? quadrantMap : smallScreenMap;

    if (isInteger) {
      return map["1"].integer;
    }

    return map[numberSign][suffix] || (width > 640 ? 4 : 1);
  }

  // for wheel event
  const [style, api] = useSpring(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
    }),
    []
  );
  // for drag event
  const [dragStyles, dragApi] = useSpring(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
    }),
    []
  );
  // rotate board on click and pass styles to board animate class
  const styles = useSpring({
    transform:
      width > 640
        ? `perspective(175dvh) rotateX(30deg) rotateZ(${rotatingCoefficient}deg)`
        : `perspective(175dvh) rotateY(-35deg) rotateZ(${rotatingCoefficient}deg)`,
  });

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        dragApi.start({ x, y });
      },
    },
    {
      target: ref,
      drag: {
        from: () => [dragStyles.x.get(), dragStyles.y.get()],
        bounds: {
          left: -100,
          right: 100,
          top: -50,
          bottom: 50,
        },
        rubberband: true,
      },
    }
  );
  const resetBoard = () => {
    setRotatingCoefficient(
      width > 640 ? Math.round(rotatingCoefficient / 360) * 360 : -90
    );
    api.start({ scale: 1, x: 0, y: 0 }); // Updates the element's style with the new scale and positions
  };

  if (!corporations || !activeEvents) return;
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const { deltaY } = event; // Gets the amount of scroll
    // const { width, height, x, y } = ref.current.getBoundingClientRect(); // Gets the dimensions and position of the element
    // const ox = event.clientX - x; // Calculates the x-coordinate of the mouse relative to the element
    // const oy = event.clientY - y; // Calculates the y-coordinate of the mouse relative to the element
    const ms = deltaY < 0 ? 1.1 : 0.9; // Determines the zoom factor based on scroll direction

    // const tx = ox - (x + width / 2); // Calculates the translation in x
    // const ty = oy - (y + height / 2); // Calculates the translation in y
    // const memo = [style.x.get(), style.y.get(), tx, ty]; // Stores initial positions and translations

    const s = style.scale.get() * ms; // Calculates the new scale
    // const newX = memo[0] - (ms - 1) * memo[2]; // Calculates the new x position
    // const newY = memo[1] - (ms - 1) * memo[3]; // Calculates the new y position
    if (s > 3 || s < 0.5) {
      return;
    }
    api.start({ scale: s, x: 0, y: 0 }); // Updates the element's style with the new scale and positions
  };
  // Helper function to check deck position
  const checkDeckPosition = (rotation: number, corpName: string) => {
    const quadrant = checkQuadrant(rotation);
    switch (corpName) {
      case "EDSC":
        return {
          deckBottom: [1, 2, 3].includes(quadrant) ? 0.12 : undefined,
          deckLeft: [1, 4, 2].includes(quadrant) ? 0.12 : undefined,
          deckTop: quadrant === 4 ? 0.12 : undefined,
          deckRight: quadrant === 3 ? 0.12 : undefined,
        };
      case "MGCR":
        return {
          deckBottom: [1, 4, 2].includes(quadrant) ? 0.12 : undefined,
          deckLeft: [1, 4, 3].includes(quadrant) ? 0.12 : undefined,
          deckTop: quadrant === 3 ? 0.12 : undefined,
          deckRight: quadrant === 2 ? 0.12 : undefined,
        };
      case "CBRT":
        return {
          deckBottom: [1, 3, 4].includes(quadrant) ? 0.12 : undefined,
          deckLeft: [3, 2, 4].includes(quadrant) ? 0.12 : undefined,
          deckTop: quadrant === 2 ? 0.12 : undefined,
          deckRight: quadrant === 1 ? 0.12 : undefined,
        };
      case "BGBO":
        return {
          deckBottom: [4, 2, 3].includes(quadrant) ? 0.12 : undefined,
          deckLeft: [2, 3, 1].includes(quadrant) ? 0.12 : undefined,
          deckTop: quadrant === 1 ? 0.12 : undefined,
          deckRight: quadrant === 4 ? 0.12 : undefined,
        };
      default:
        return {};
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setRotatingCoefficient(rotatingCoefficient + 90);
        }}
        className="rotate__button__left rotate__button"
      >
        <LuArrowBigLeft size={40} />
      </button>

      <button
        onClick={resetBoard}
        className="rotate__button__center rotate__button"
      >
        Reset
      </button>
      <button
        onClick={() => {
          // simulatePinch();
          // if(ref && ref.current) {
          //   ref.current.style.transform = "none";
          // }
          setRotatingCoefficient(rotatingCoefficient - 90);
        }}
        className="rotate__button__right rotate__button"
      >
        <LuArrowBigRight size={40} />
      </button>
      <animated.div
        className={"board_parent_grab "}
        style={dragStyles}
        ref={ref}
      >
        <animated.div className={"board_animate "} style={styles} ref={board}>
          <animated.div
            onWheel={handleWheel}
            style={style}
            className={` board-sides`}
          >
            <CardModal />
            <div className="face" id="front"></div>
            <div className="face" id="side-l"></div>
            <div className="face" id="side-r"></div>
            <div className="face" id="back"></div>
            <div className="gameboard">
              <CorporationLadder
                rotatingCoefficient={rotatingCoefficient}
                rotate={0}
                className="top EDSC"
                corpName="EDSC"
                bottom={0}
                left={0}
                CardBgColor={"#C1061A"}
                CardTextColor={"#FFFFFF"}
                bgImage={"/images/card-backs/EDSC.webp"}
                priceTracker={"/images/priceTrackers/EDSC price tracker.webp"}
                price={corporations.EDSC.price / 10}
                activeEvents={Object.values(activeEvents.EDSC.cards)[0]}
                abilityStatus={corporations.EDSC.abilities}
                onDoubleClick={() => {
                  if (width > 640) {
                    setRotatingCoefficient(0);
                  } else {
                    setRotatingCoefficient(270);
                  }
                }}
              >
                <Card
                  deck={50}
                  {...checkDeckPosition(rotatingCoefficient / 360, "EDSC")}
                  frontImage={duplicateArray(
                    "/images/card-backs/EDSC.webp",
                    50
                  )}
                  draggable={false}
                  classes="EDSC-card"
                />
              </CorporationLadder>
              <CorporationLadder
                rotatingCoefficient={rotatingCoefficient}
                rotate={90}
                className="left MGCR"
                corpName="MGCR"
                CardBgColor={"#222E3C"}
                CardTextColor={"#C87E0E"}
                bgImage={"/images/card-backs/MGCR.webp"}
                priceTracker={"/images/priceTrackers/MGCR price tracker.webp"}
                price={corporations.MGCR.price / 10}
                activeEvents={Object.values(activeEvents.MGCR.cards)[0]}
                abilityStatus={corporations.MGCR.abilities}
                onDoubleClick={() => {
                  if (width > 640) {
                    setRotatingCoefficient(270);
                  } else {
                    setRotatingCoefficient(180);
                  }
                }}
              >
                <Card
                  deck={50}
                  {...checkDeckPosition(rotatingCoefficient / 360, "MGCR")}
                  frontImage={duplicateArray(
                    "/images/card-backs/MGCR.webp",
                    50
                  )}
                  draggable={false}
                  classes="MGCR-card"
                />
              </CorporationLadder>
              <CorporationLadder
                rotate={180}
                rotatingCoefficient={rotatingCoefficient}
                className="bottom CBRT"
                corpName="CBRT"
                top={0}
                right={0}
                CardBgColor={"#16100F"}
                CardTextColor={"#991208"}
                bgImage={"/images/card-backs/CBRT.webp"}
                priceTracker={"/images/priceTrackers/CBRT price tracker.webp"}
                price={corporations.CBRT.price / 10}
                activeEvents={Object.values(activeEvents.CBRT.cards)[0]}
                abilityStatus={corporations.CBRT.abilities}
                onDoubleClick={() => {
                  if (width > 640) {
                    setRotatingCoefficient(180);
                  } else {
                    setRotatingCoefficient(90);
                  }
                }}
              >
                <Card
                  deck={50}
                  {...checkDeckPosition(rotatingCoefficient / 360, "CBRT")}
                  frontImage={duplicateArray(
                    "/images/card-backs/CBRT.webp",
                    50
                  )}
                  draggable={false}
                  classes="CBRT-card"
                />
              </CorporationLadder>
              <CorporationLadder
                rotatingCoefficient={rotatingCoefficient}
                rotate={270}
                className="right BGBO"
                corpName="BGBO"
                CardBgColor={"#FFFFFF"}
                CardTextColor={"#395693"}
                bgImage={"/images/card-backs/BGBO.webp"}
                priceTracker={"/images/priceTrackers/BGBO price tracker.webp"}
                price={corporations.BGBO.price / 10}
                activeEvents={Object.values(activeEvents.BGBO.cards)[0]}
                abilityStatus={corporations.BGBO.abilities}
                onDoubleClick={() => {
                  if (width > 640) {
                    setRotatingCoefficient(90);
                  } else {
                    setRotatingCoefficient(-0);
                  }
                }}
              >
                <Card
                  deck={50}
                  {...checkDeckPosition(rotatingCoefficient / 360, "BGBO")}
                  frontImage={duplicateArray(
                    "/images/card-backs/BGBO.webp",
                    50
                  )}
                  draggable={false}
                  classes="BGBO-card"
                />
              </CorporationLadder>
              <Spiral turnTracker={currentTurn}>
                <>
                  <Card
                    // width={`${containerHeight / 2.85}px`}
                    // height={`${containerHeight / 2.85}px`}
                    deck={50}
                    deckBottom={
                      checkQuadrant(rotatingCoefficient / 360) == 2
                        ? 0.08
                        : checkQuadrant(rotatingCoefficient / 360) == 3
                        ? 0.008
                        : undefined
                    }
                    deckLeft={
                      // checkQuadrant(rotatingCoefficient / 360) == 3 ||
                      checkQuadrant(rotatingCoefficient / 360) == 2 ||
                      checkQuadrant(rotatingCoefficient / 360) == 1 ||
                      checkQuadrant(rotatingCoefficient / 360) == 4
                        ? 0.06
                        : undefined
                    }
                    deckTop={
                      checkQuadrant(rotatingCoefficient / 360) == 4 ||
                      checkQuadrant(rotatingCoefficient / 360) == 1
                        ? 0.08
                        : undefined
                    }
                    deckRight={
                      checkQuadrant(rotatingCoefficient / 360) == 3
                        ? 0.06
                        : undefined
                    }
                    frontImage={duplicateArray(
                      "/images/card-backs/Global.webp",
                      50
                    )}
                    draggable={false}
                    classes="GLOBAL-card"
                  />
                  <div
                    className="global__active"
                    // style={{
                    //   width: `${containerHeight / 3}px`,
                    //   height: `${containerHeight / 3}px`,
                    // }}
                  >
                    {Object.values(activeEvents.Global.cards)[0] && (
                      <ActiveEvents
                        name={Object.values(activeEvents.Global.cards)[0]?.name}
                        action={
                          Object.values(activeEvents.Global.cards)[0]?.action
                        }
                        text={Object.values(activeEvents.Global.cards)[0]?.text}
                      />
                    )}
                  </div>
                </>
              </Spiral>
            </div>
          </animated.div>
        </animated.div>{" "}
      </animated.div>
    </>
  );
}

export default GameBoard;
