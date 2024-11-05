"use client";

import React, { useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";
import Image from "next/image";
import shortToken from "../../../../../public/images/trades/Short.webp";
import longToken from "../../../../../public/images/trades/Long.webp";
import margin from "../../../../../public/images/trades/Margin grey.webp";
import call from "../../../../../public/images/trades/Call.webp";
import put from "../../../../../public/images/trades/Put.webp";
import option from "../../../../../public/images/trades/options price chart symbol.webp";
import { ITradeForm } from "@/types/game/trade";
import { UseFormSetValue } from "react-hook-form";
import { useActions, useAppSelector } from "@/store/hooks";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import TradesPosition from "@/components/atoms/positions/tradePosition";

export interface IOptions {
  formKey: string | number;
  name: "primaryLeg" | "coveringLeg";
  min: number;
  max: number;
  disabledIcons: string[];
  disabledFields: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRangeBtnClick: (...args: any[]) => void;
  corporation: string;
  setValue: UseFormSetValue<ITradeForm>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tradeState: any;
  setShowFocus: React.Dispatch<React.SetStateAction<boolean>>;
  onOptionPriceChartClick: (type: string) => void;
  showFocus: boolean;
  setValidate: React.Dispatch<React.SetStateAction<boolean>>;
}
const OptionsWrapper = styled(Box)({
  padding: "0.3rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  //   width: "10rem",
  fontSize: "0.6rem",

  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const MarginImageWrapper = styled(Box)({
  width: "1.5rem",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});

const OptionsImageWrapper = styled(Box)({
  width: "1.7rem",
  cursor: "pointer",
  position: "relative",
  height: "0",
  "@media (max-width:640px)": {
    // transform: "rotate(90deg);",
    // width: "2.5rem",
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const PositionImageWrapper = styled(Box)({
  width: "4.2rem",
  cursor: "pointer",

  transition: "all ease-in-out 0.8s",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const ButtonPositionImageWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",

  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const OptionsPositionImageWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const CallPositionImageWrapper = styled(Box)({
  transform: "translate(0px, -27px)",
  width: "3rem",
  cursor: "pointer",
  transition: "all ease-in-out 0.8s",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const PutPositionImageWrapper = styled(Box)({
  transform: "translate(44px, 4px)",
  width: "3rem",
  cursor: "pointer",
  transition: "all ease-in-out 0.8s",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const PositionButtonsWrapper = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "14rem",
  gap: "1.7rem",
  margin: "1.2rem 0 0 0",
  "@media (max-width:640px)": {
    justifyContent: "space-evenly",
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const OptionsButtonsWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
});
const Options = ({
  formKey,
  name,
  max,
  disabledIcons,
  onRangeBtnClick,
  corporation,
  setValue,
  tradeState,
  onOptionPriceChartClick,
  setShowFocus,
  setValidate,
}: IOptions) => {
  // const [position, setPosition] = useState(longShort);
  const longRef = useRef<HTMLDivElement>(null);
  const shortRef = useRef<HTMLDivElement>(null);
  const callButton = useRef<HTMLDivElement>(null);
  const putButton = useRef<HTMLDivElement>(null);
  const bgboCorpRef = useRef<HTMLImageElement>(null);
  const cbrtCorpRef = useRef<HTMLImageElement>(null);
  const mgcrCorpRef = useRef<HTMLImageElement>(null);
  const edscCorpRef = useRef<HTMLImageElement>(null);
  const tagCorpRef = useRef<HTMLImageElement>(null);
  const { openOptionPriceModal } = useActions();
  const { adjust } = useAppSelector((state) => state.gamePlay);
  const { width } = useWindowSizeContext();

  const tradeType = adjust?.tradeType ?? "New Trade";
  // const { currentTurn } = useAppSelector((state) => {
  //   // console.log(state.game.data);

  //   return state.game.data;
  // });

  // translate corp and option images
  useEffect(() => {
    if (!callButton || !callButton.current || !putButton || !putButton.current)
      return;

    if (tradeState[name].type === "call") {
      if (width > 640) {
        callButton.current.style.transform = `translate(1.4px, -135px)`;
      } else {
        callButton.current.style.transform = `translate(-19.6px, -134.672px)`;
      }
    } else {
      callButton.current.style.transform = `translate(0px, -27px)`;
    }
    if (tradeState[name].type === "put") {
      if (width > 640) {
        putButton.current.style.transform = `translate(1.4px, -79px)`;
      } else {
        putButton.current.style.transform = `translate(-21.6px, -79.5px)`;
      }
    } else {
      putButton.current.style.transform = `translate(44px, 4px)`;
    }

    // translate(146px, -217px)
  }, [tradeState[name].type, width]);

  // translate long and short tokens

  useEffect(() => {
    if (!longRef || !longRef.current || !shortRef || !shortRef.current) return;
    if (tradeState[name].direction === "long") {
      // setPosition(longToken);

      if (width > 640) {
        longRef.current.style.transform = `translate(139px, -212px)`;
      } else {
        longRef.current.style.transform = `translate(132px, -212px)`;
      }
      shortRef.current.style.transform = `none`;
    } else if (tradeState[name].direction === "short") {
      // setPosition(shortToken);
      longRef.current.style.transform = `none`;
      if (width > 640) {
        shortRef.current.style.transform = `translate(139px, -242px)`;
      } else {
        shortRef.current.style.transform = `translate(132px, -241px)`;
      }
    }
  }, [tradeState]);

  useEffect(() => {
    const animateCorps = () => {
      const edsc = document.getElementById("EDSC");
      const bgbo = document.getElementById("BGBO");
      const mgcr = document.getElementById("MGCR");
      const cbrt = document.getElementById("CBRT");
      const polyTag = tagCorpRef.current?.getBoundingClientRect();

      if (!edsc || !bgbo || !mgcr || !cbrt || !polyTag) return;

      const edscRect = edsc.getBoundingClientRect();
      const bgboRect = bgbo.getBoundingClientRect();
      const mgcrRect = mgcr.getBoundingClientRect();
      const cbrtRect = cbrt.getBoundingClientRect();

      const updateStyles = (
        element: HTMLDivElement | null,
        top: number,
        left: number,
        right?: boolean
      ) => {
        if (element) {
          element.style.top = `${top}px`;
          if (right) {
            element.style.right = `${left}px`;
          } else {
            element.style.left = `${left}px`;
          }
        }
      };

      const updatePositions = () => {
        if (width > 640) {
          switch (corporation) {
            case "EDSC":
              updateStyles(
                bgboCorpRef.current,
                bgboRect.top + 10,
                bgboRect.left + 10
              );
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.top + 10,
                cbrtRect.left + 10
              );
              updateStyles(
                edscCorpRef.current,
                polyTag.top - 3.5,
                polyTag.left
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.top + 10,
                mgcrRect.left + 10
              );
              break;
            case "BGBO":
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.top + 10,
                cbrtRect.left + 10
              );
              updateStyles(
                edscCorpRef.current,
                edscRect.top + 10,
                edscRect.left + 10
              );
              updateStyles(
                bgboCorpRef.current,
                polyTag.top - 3.5,
                polyTag.left
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.top + 10,
                mgcrRect.left + 10
              );
              break;
            case "MGCR":
              updateStyles(
                mgcrCorpRef.current,
                polyTag.top - 3.5,
                polyTag.left
              );
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.top + 10,
                cbrtRect.left + 10
              );
              updateStyles(
                bgboCorpRef.current,
                bgboRect.top + 10,
                bgboRect.left + 10
              );
              updateStyles(
                edscCorpRef.current,
                edscRect.top + 10,
                edscRect.left + 10
              );
              break;
            case "CBRT":
              updateStyles(
                edscCorpRef.current,
                edscRect.top + 10,
                edscRect.left + 10
              );
              updateStyles(
                cbrtCorpRef.current,
                polyTag.top - 3.5,
                polyTag.left
              );
              updateStyles(
                bgboCorpRef.current,
                bgboRect.top + 10,
                bgboRect.left + 10
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.top + 10,
                mgcrRect.left + 10
              );
              break;
            default:
              updateStyles(
                edscCorpRef.current,
                edscRect.top + 10,
                edscRect.left + 10
              );
              updateStyles(
                bgboCorpRef.current,
                bgboRect.top + 10,
                bgboRect.left + 10
              );
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.top + 10,
                cbrtRect.left + 10
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.top + 10,
                mgcrRect.left + 10
              );
              break;
          }
        } else {
          bgboCorpRef.current?.style.removeProperty("left");
          cbrtCorpRef.current?.style.removeProperty("left");
          edscCorpRef.current?.style.removeProperty("left");
          mgcrCorpRef.current?.style.removeProperty("left");

          switch (corporation) {
            case "EDSC":
              updateStyles(
                bgboCorpRef.current,
                bgboRect.left + 10,
                bgboRect.top + 10,
                true
              );
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.left + 10,
                cbrtRect.top + 10,
                true
              );
              updateStyles(
                edscCorpRef.current,
                polyTag.left,
                polyTag.top - 3.5,
                true
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.left + 10,
                mgcrRect.top + 10,
                true
              );
              break;
            case "BGBO":
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.left + 10,
                cbrtRect.top + 10,
                true
              );
              updateStyles(
                edscCorpRef.current,
                edscRect.left + 10,
                edscRect.top + 10,
                true
              );
              updateStyles(
                bgboCorpRef.current,
                polyTag.left,
                polyTag.top - 3.5,
                true
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.left + 10,
                mgcrRect.top + 10,
                true
              );
              break;
            case "MGCR":
              updateStyles(
                mgcrCorpRef.current,
                polyTag.left,
                polyTag.top - 3.5,
                true
              );
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.left + 10,
                cbrtRect.top + 10,
                true
              );
              updateStyles(
                bgboCorpRef.current,
                bgboRect.left + 10,
                bgboRect.top + 10,
                true
              );
              updateStyles(
                edscCorpRef.current,
                edscRect.left + 10,
                edscRect.top + 10,
                true
              );
              break;
            case "CBRT":
              updateStyles(
                edscCorpRef.current,
                edscRect.left + 10,
                edscRect.top + 10,
                true
              );
              updateStyles(
                cbrtCorpRef.current,
                polyTag.left,
                polyTag.top - 3.5,
                true
              );
              updateStyles(
                bgboCorpRef.current,
                bgboRect.left + 10,
                bgboRect.top + 10,
                true
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.left + 10,
                mgcrRect.top + 10,
                true
              );
              break;
            default:
              updateStyles(
                edscCorpRef.current,
                edscRect.left + 10,
                edscRect.top + 10,
                true
              );
              updateStyles(
                bgboCorpRef.current,
                bgboRect.left + 10,
                bgboRect.top + 10,
                true
              );
              updateStyles(
                cbrtCorpRef.current,
                cbrtRect.left + 10,
                cbrtRect.top + 10,
                true
              );
              updateStyles(
                mgcrCorpRef.current,
                mgcrRect.left + 10,
                mgcrRect.top + 10,
                true
              );
              break;
          }
        }
      };

      requestAnimationFrame(updatePositions);
    };

    const tradeModal = document.getElementById("trade-modal");

    const handleScroll = () => {
      bgboCorpRef.current?.classList.remove("transition");
      cbrtCorpRef.current?.classList.remove("transition");
      edscCorpRef.current?.classList.remove("transition");
      mgcrCorpRef.current?.classList.remove("transition");
      animateCorps();
    };

    tradeModal?.addEventListener("scroll", handleScroll);

    if (
      !bgboCorpRef ||
      !bgboCorpRef.current ||
      !cbrtCorpRef ||
      !cbrtCorpRef.current ||
      !edscCorpRef ||
      !edscCorpRef.current ||
      !mgcrCorpRef ||
      !mgcrCorpRef.current ||
      !tagCorpRef ||
      !tagCorpRef.current
    )
      return;
    // Add the transition class before animating
    bgboCorpRef.current.classList.add("transition");
    cbrtCorpRef.current.classList.add("transition");
    edscCorpRef.current.classList.add("transition");
    mgcrCorpRef.current.classList.add("transition");

    // Initial animation
    animateCorps();

    // Clean up: remove event listener when component unmounts
    return () => {
      tradeModal?.removeEventListener("scroll", handleScroll);
    };
  }, [corporation, width, tradeState]);

  return (
    <OptionsWrapper>
      <TradesPosition
        formKey={formKey}
        name={name}
        positionType="Options"
        tradeState={tradeState}
        tradeType={tradeType}
        setShowFocus={setShowFocus}
        max={max}
        // min={min}
        disabledIcons={disabledIcons}
        onRangeBtnClick={onRangeBtnClick}
        setValidate={setValidate}
        tagCorpRef={tagCorpRef}
        bgboCorpRef={bgboCorpRef}
        cbrtCorpRef={cbrtCorpRef}
        edscCorpRef={edscCorpRef}
        mgcrCorpRef={mgcrCorpRef}
        arrows={true}
      />

      <OptionsButtonsWrapper>
        <OptionsImageWrapper>
          <Image
            src={option}
            alt="option symbol"
            onClick={() => {
              if (name === "coveringLeg") return;
              if (tradeType !== "New Trade") return;
              openOptionPriceModal("option");
              onOptionPriceChartClick(name);
            }}
            className="absolute"
            style={{
              paddingTop: "0.5rem",
            }}
            // disabled={legState?.type === "shares"}
          />
        </OptionsImageWrapper>
      </OptionsButtonsWrapper>
      <PositionButtonsWrapper>
        <ButtonPositionImageWrapper>
          <PositionImageWrapper ref={longRef}>
            <Image
              onClick={() => {
                // setPosition(longToken);
                if (name === "coveringLeg") return;
                if (tradeType !== "New Trade") return;
                setValue(`${name}.direction`, "long");
              }}
              src={longToken}
              alt="long"
            />
          </PositionImageWrapper>
          <PositionImageWrapper ref={shortRef}>
            <Image
              onClick={() => {
                // setPosition(shortToken);
                if (name === "coveringLeg") return;
                if (tradeType !== "New Trade") return;
                setValue(`${name}.direction`, "short");
              }}
              src={shortToken}
              alt=" short"
            />
          </PositionImageWrapper>
        </ButtonPositionImageWrapper>

        <MarginImageWrapper>
          <Image
            src={margin}
            alt="margin"
            onClick={() => {
              if (name === "coveringLeg") return;
              if (tradeType !== "New Trade") return;
              setValue(
                `${name}.margin`,
                tradeState?.primaryLeg?.margin === true ||
                  tradeState?.coveringLeg?.margin === true
                  ? false
                  : true
              );
            }}
          />
        </MarginImageWrapper>
        <OptionsPositionImageWrapper>
          <PutPositionImageWrapper ref={putButton}>
            <Image
              src={put}
              alt="put-grey"
              onClick={() => {
                if (name === "coveringLeg") return;
                if (tradeType !== "New Trade") return;
                setValue(`${name}.type`, "put");
              }}
            />
          </PutPositionImageWrapper>
          <CallPositionImageWrapper ref={callButton}>
            <Image
              src={call}
              alt="call-grey"
              onClick={() => {
                if (name === "coveringLeg") return;
                if (tradeType !== "New Trade") return;
                setValue(`${name}.type`, "call");
              }}
            />
          </CallPositionImageWrapper>
        </OptionsPositionImageWrapper>
      </PositionButtonsWrapper>
    </OptionsWrapper>
  );
};

export default Options;
