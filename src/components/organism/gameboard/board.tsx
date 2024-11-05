"use client";
import React, { useEffect, useState, useRef, memo } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  createUseGesture,
  dragAction,
  pinchAction,
  wheelAction,
} from "@use-gesture/react";
import { LuArrowBigRight, LuArrowBigLeft } from "react-icons/lu";

import CorporationLadder from "./corporationLadder";
import { useAppSelector } from "@/store/hooks";
import Spiral from "./spiral";
import CardModal from "./activeEventsModal";
import ActiveEvents from "./activeEvents";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import Card from "@/components/atoms/cards/card";

import "./randomWave.css";
import { ICorporation, ICurrency } from "@/types/interfaces/game/game";

const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);

// Define the active event types
type ActiveEventType = {
  BGBO: ICurrency;
  MGCR: ICurrency;
  CBRT: ICurrency;
  Global: ICurrency;
  EDSC: ICurrency;
};

// types of corp selection
type CorpDataType = {
  corpName: "EDSC" | "MGCR" | "CBRT" | "BGBO" | "Global";
  position: string;
  bottom?: number; // Made optional
  left?: number; // Made optional
  top?: number; // Made optional
  right?: number; // Made optional
  rotate: number;
  cardBgColor: string;
  cardTextColor: string;
};

const corpData: CorpDataType[] = [
  {
    corpName: "EDSC",
    position: "top",
    bottom: 0,
    left: 0,
    rotate: 0,
    cardBgColor: "#C1061A",
    cardTextColor: "#FFFFFF",
  },
  {
    corpName: "MGCR",
    position: "left",
    rotate: 90,
    cardBgColor: "#222E3C",
    cardTextColor: "#C87E0E",
  },
  {
    corpName: "CBRT",
    position: "bottom",
    top: 0,
    right: 0,
    rotate: 180,
    cardBgColor: "#16100F",
    cardTextColor: "#991208",
  },
  {
    corpName: "BGBO",
    position: "right",
    rotate: 270,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#395693",
  },
];

// Helper function to check deck position
const checkDeckPosition = (
  rotation: number,
  corpName: string,
  checkQuadrant: (rotation: number) => number
) => {
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
    case "GLOBAL":
      return {
        deckBottom: quadrant === 2 ? 0.08 : quadrant === 3 ? 0.008 : undefined,
        deckLeft: [1, 2, 4].includes(quadrant) ? 0.06 : undefined,
        deckTop: [1, 4].includes(quadrant) ? 0.08 : undefined,
        deckRight: quadrant === 3 ? 0.06 : undefined,
      };
    default:
      return {};
  }
};

// turn string to array to populate the image array
function duplicateArray(str: string, n: number) {
  return Array(n).fill(str);
}

const GameBoard = () => {
  const { width } = useWindowSizeContext();
  const { corporations, activeEvents, currentTurn } = useAppSelector(
    (state) => state.game.data
  );
  const boardRef = useRef<HTMLDivElement>(null);

  const [rotatingCoefficient, setRotatingCoefficient] = useState(
    width > 640 ? 0 : -90
  );

  const [style, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }));
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

  useEffect(() => {
    const preventDefaultGesture = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefaultGesture);
    document.addEventListener("gesturechange", preventDefaultGesture);
    document.addEventListener("gestureend", preventDefaultGesture);
    return () => {
      document.removeEventListener("gesturestart", preventDefaultGesture);
      document.removeEventListener("gesturechange", preventDefaultGesture);
      document.removeEventListener("gestureend", preventDefaultGesture);
    };
  }, []);

  useEffect(() => {
    setRotatingCoefficient(width > 640 ? 0 : -90);
  }, [width]);

  // scale animation effect on the board
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const scaleChange = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = style.scale.get() * scaleChange;
    if (newScale < 0.5 || newScale > 3) return;
    api.start({ scale: newScale });
  };

  // reset board state
  const resetBoard = () => {
    setRotatingCoefficient(width > 640 ? 0 : -90);
    api.start({ scale: 1, x: 0, y: 0 });
  };

  // rotate board on double click
  const handleDoubleClick = (corpName: string) => {
    switch (corpName) {
      case "EDSC":
        setRotatingCoefficient(width > 640 ? 0 : 270);
        break;
      case "MGCR":
        setRotatingCoefficient(width > 640 ? 270 : 180);
        break;
      case "CBRT":
        setRotatingCoefficient(width > 640 ? 180 : 90);
        break;
      case "BGBO":
        setRotatingCoefficient(width > 640 ? 90 : 0);
        break;
      default:
        break;
    }
  };

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

  const rotateBoard = (angle: number) => {
    setRotatingCoefficient((prev) => prev + angle);
  };

  // drag board around
  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        dragApi.start({ x, y });
      },
    },
    {
      target: boardRef,
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
  return (
    <>
      <ControlButtons
        onRotateLeft={() => rotateBoard(90)}
        onRotateRight={() => rotateBoard(-90)}
        onReset={resetBoard}
      />
      <animated.div
        className="board_parent_grab"
        style={dragStyles}
        ref={boardRef}
      >
        <animated.div className="board_animate" style={styles}>
          <animated.div
            onWheel={handleWheel}
            style={style}
            className="board-sides"
          >
            <CardModal />
            <BoardSidesComponents />
            <div className="gameboard">
              <CorporationComponents
                rotatingCoefficient={rotatingCoefficient}
                corporations={corporations}
                activeEvents={activeEvents}
                checkQuadrant={checkQuadrant}
                handleDoubleClick={handleDoubleClick}
              />
              <SpiralComponents
                currentTurn={currentTurn}
                activeEvents={activeEvents}
                rotatingCoefficient={rotatingCoefficient}
                checkQuadrant={checkQuadrant}
              />{" "}
            </div>
          </animated.div>
        </animated.div>
      </animated.div>
    </>
  );
};

const ControlButtons = memo(
  ({
    onRotateLeft,
    onRotateRight,
    onReset,
  }: {
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onReset: () => void;
  }) => (
    <div className="control-buttons">
      <button
        onClick={onRotateLeft}
        className="rotate__button__left rotate__button"
      >
        <LuArrowBigLeft size={40} />
      </button>
      <button
        onClick={onReset}
        className="rotate__button__center rotate__button"
      >
        Reset
      </button>
      <button
        onClick={onRotateRight}
        className="rotate__button__right rotate__button"
      >
        <LuArrowBigRight size={40} />
      </button>
    </div>
  )
);

const CorporationComponents = memo(
  ({
    rotatingCoefficient,
    corporations,
    activeEvents,
    checkQuadrant,
    handleDoubleClick,
  }: {
    rotatingCoefficient: number;
    corporations: ICorporation;
    activeEvents: ActiveEventType;
    checkQuadrant: (rotation: number) => number;
    handleDoubleClick: (corpName: string) => void;
  }) => (
    <>
      {corpData.map((corpDatas, index) => (
        <CorporationLadder
          key={index}
          rotatingCoefficient={rotatingCoefficient}
          corpName={corpDatas.corpName}
          price={corporations[corpDatas.corpName].price / 10}
          activeEvents={
            Object.values(activeEvents[corpDatas.corpName].cards)[0]
          }
          rotate={corpDatas.rotate}
          priceTracker={`/images/priceTrackers/${corpDatas.corpName} price tracker.webp`}
          bgImage={`/images/card-backs/${corpDatas.corpName}.webp`}
          abilityStatus={corporations[corpDatas.corpName].abilities}
          className={`${corpDatas.position} ${corpDatas.corpName}`}
          top={corpDatas?.top}
          bottom={corpDatas?.bottom}
          right={corpDatas?.right}
          left={corpDatas?.left}
          CardBgColor={corpDatas.cardBgColor}
          CardTextColor={corpDatas.cardTextColor}
          onDoubleClick={() => handleDoubleClick(corpDatas.corpName)}
        >
          <Card
            deck={50}
            draggable={false}
            classes={`${corpDatas.corpName}-card`}
            frontImage={duplicateArray(
              `/images/card-backs/${corpDatas.corpName}.webp`,
              50
            )}
            {...checkDeckPosition(
              rotatingCoefficient / 360,
              corpDatas.corpName,
              checkQuadrant
            )}
          />
        </CorporationLadder>
      ))}
    </>
  )
);

const SpiralComponents = memo(
  ({
    currentTurn,
    rotatingCoefficient,
    checkQuadrant,
    activeEvents,
  }: {
    currentTurn: number;
    rotatingCoefficient: number;
    activeEvents: ActiveEventType;
    checkQuadrant: (rotation: number) => number;
  }) => (
    <Spiral turnTracker={currentTurn}>
      <>
        <Card
          deck={50}
          draggable={false}
          classes="GLOBAL-card"
          frontImage={duplicateArray("/images/card-backs/Global.webp", 50)}
          {...checkDeckPosition(
            rotatingCoefficient / 360,
            "GLOBAL",
            checkQuadrant
          )}
        />
        <div className="global__active">
          <ActiveEvents
            name={Object.values(activeEvents.Global.cards)[0]?.name}
            action={Object.values(activeEvents.Global.cards)[0]?.action}
            text={Object.values(activeEvents.Global.cards)[0]?.text}
          />
        </div>{" "}
      </>
    </Spiral>
  )
);
const BoardSidesComponents = memo(() => (
  <>
    <div className="face" id="front"></div>
    <div className="face" id="side-l"></div>
    <div className="face" id="side-r"></div>
    <div className="face" id="back"></div>
  </>
));

BoardSidesComponents.displayName = "BoardSidesComponents";
SpiralComponents.displayName = "SpiralComponents";
GameBoard.displayName = "GameBoard";
CorporationComponents.displayName = "CorporationComponents";
ControlButtons.displayName = "ControlButtons";
export default memo(GameBoard);
