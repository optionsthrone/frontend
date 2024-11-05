"use client";

import React, { useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";
import Image from "next/image";
import shortToken from "../../../../../public/images/trades/Short.webp";
import longToken from "../../../../../public/images/trades/Long.webp";
import margin from "../../../../../public/images/trades/Margin.webp";
import callGrey from "../../../../../public/images/trades/Call grey.webp";
import putGrey from "../../../../../public/images/trades/Put grey.webp";
import { ITradeForm } from "@/types/game/trade";
import { UseFormSetValue } from "react-hook-form";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import { useAppSelector } from "@/store/hooks";
import TradesPosition from "@/components/atoms/positions/tradePosition";

export interface IShares {
  formKey: string | number;
  name: "primaryLeg" | "coveringLeg";
  max: number;
  disabledIcons: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRangeBtnClick: (...args: any[]) => void;
  corporation: string;
  setValue: UseFormSetValue<ITradeForm>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tradeState: any;
  setShowFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setValidate: React.Dispatch<React.SetStateAction<boolean>>;
}
const SharesWrapper = styled(Box)({
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
  cursor: "pointer",
  transition: "all ease-in-out 0.8s",
  "@media (max-width:640px)": {
    // transform: "rotate(90deg);",
    // width: "2rem",
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
    // transform: "rotate(0deg);",
    // width: "2.5rem",
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
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});
const PutPositionImageWrapper = styled(Box)({
  transform: "translate(44px, 4px)",
  width: "3rem",
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
const Shares = ({
  formKey,
  name,
  max,
  disabledIcons,
  onRangeBtnClick,
  corporation,
  setValue,
  tradeState,
  setShowFocus,
  setValidate,
}: IShares) => {
  const { width } = useWindowSizeContext();
  // const [position, setPosition] = useState(longShort);

  const longRef = useRef<HTMLDivElement>(null);
  const shortRef = useRef<HTMLDivElement>(null);
  const marginRef = useRef<HTMLDivElement>(null);
  const bgboCorpRef = useRef<HTMLImageElement>(null);
  const cbrtCorpRef = useRef<HTMLImageElement>(null);
  const mgcrCorpRef = useRef<HTMLImageElement>(null);
  const edscCorpRef = useRef<HTMLImageElement>(null);
  const tagCorpRef = useRef<HTMLImageElement>(null);

  const { adjust } = useAppSelector((state) => state.gamePlay);
  const tradeType = adjust?.tradeType ?? "New Trade";
  const { currentTurn } = useAppSelector((state) => state.game.data);

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
    if (!marginRef || !marginRef.current) return;
    if (tradeState[name]?.margin === true) {
      // translate(96px, -90px)
      if (width < 640) {
        marginRef.current.style.transform = `translate(77px, -87px)`;
      } else {
        marginRef.current.style.transform = `translate(91px, -87px)`;
      }
    } else {
      marginRef.current.style.transform = `none`;
    }
  }, [tradeState, width]);
  // top: -265px;
  // left: -152.094px;

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

  // console.log(tradeState);

  // translate(180px, 243px)
  // let corpTag;
  // switch (corporation) {
  //   case "BGBO":
  //     corpTag = bgbo;
  //     break;
  //   case "CBRT":
  //     corpTag = cbrt;
  //     break;
  //   case "EDSC":
  //     corpTag = edsc;
  //     break;
  //   case "MGCR":
  //     corpTag = mgcr;
  //     break;
  //   default:
  //     corpTag = polygon;
  // }
  // useEffect(() => {

  // }, []);
  useEffect(() => {
    if (currentTurn === 0) {
      setValue(`${name}.direction`, "long");
    }
  }, []);

  return (
    <SharesWrapper>
      <TradesPosition
        formKey={formKey}
        name={name}
        positionType="Shares"
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
              alt="long "
            />
          </PositionImageWrapper>
          <PositionImageWrapper ref={shortRef}>
            <Image
              onClick={() => {
                if (name === "coveringLeg") return;
                if (tradeType !== "New Trade") return;
                if (currentTurn === 0) return;
                // setPosition(shortToken);
                setValue(`${name}.direction`, "short");
                setValue(`${name}.margin`, true);
              }}
              src={shortToken}
              alt=" short"
            />
          </PositionImageWrapper>
        </ButtonPositionImageWrapper>

        <MarginImageWrapper ref={marginRef}>
          <Image
            src={margin}
            alt="margin"
            onClick={() => {
              if (name === "coveringLeg") return;
              if (tradeType !== "New Trade") return;
              if (currentTurn === 0) return;
              if (tradeState[name].direction === "short") {
                setValue(`${name}.margin`, true);
                return;
              }
              setValue(
                `${name}.margin`,
                tradeState[name].margin === true ? false : true
              );
            }}
          />
        </MarginImageWrapper>
        <OptionsPositionImageWrapper>
          <PutPositionImageWrapper>
            <Image src={putGrey} alt="put-grey" />
          </PutPositionImageWrapper>
          <CallPositionImageWrapper>
            <Image src={callGrey} alt="call-grey" />
          </CallPositionImageWrapper>
        </OptionsPositionImageWrapper>
      </PositionButtonsWrapper>
    </SharesWrapper>
  );
};

export default Shares;
