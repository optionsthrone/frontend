"use client";

import React, { forwardRef, Ref } from "react";
import { Box, styled } from "@mui/material";
import longShort from "/public/images/trades/Long-Short.webp";
import Image from "next/image";
import FormLevelInputNumber from "../form/FormLevelInputNumber";
import shortToken from "/public/images/trades/Short.webp";
import longToken from "/public/images/trades/Long.webp";
// import marginGrey from "/public/images/trades/Margin grey.webp";
import margin from "/public/images/trades/Margin.webp";
import optionTypePolygon from "/public/images/trades/optionType.webp";
import polygon from "/public/images/trades/corpTag.webp";
import bgbo from "/public/images/positions/BGBO.webp";
import cbrt from "/public/images/positions/CBRT.webp";
import edsc from "/public/images/positions/EDSC.webp";
import mgcr from "/public/images/positions/MGCR.webp";
// import call from "/public/images/trades/Call.webp";
// import put from "/public/images/trades/Put.webp";
// import option from "/public/images/trades/options price chart symbol.webp";
import marginCancel from "/public/images/trades/margin cancel.webp";
import { useAppSelector } from "@/store/hooks";

const MainWrapper = styled(Box)({
  gap: "0.2rem",
  background: "black",
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-between",
  alignItems: "center",
  // width: "min(15vw,13rem)",
  aspectRatio: "333/278",
  fontSize: "0.6rem",
});

const HeaderWrapper = styled(Box)({
  padding: "0.3rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  alignItems: "center",
  width: "100%",
  fontSize: "0.9rem",
  backgroundColor: "#13192F",
  color: "white",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
    width: "100%",
  },
});
const PositionImageWrapper = styled(Box)({
  width: "37%",
  cursor: "pointer",
  transition: "all ease-in-out 0.8s",
});

const BodyWrapper = styled(Box)({
  padding: "0.3rem",
  display: "flex",
  flexDirection: "row",
  gap: "0.9rem",
  alignItems: "center",
  justifyContent: "space-around",
  width: "100%",
  fontSize: "0.6rem",
  backgroundColor: "#112E50",
  color: "white",
  height: "-webkit-fill-available",
  // height: "9rem",
  // minHeight: "9rem",
  // maxHeight: "9rem",
  position: "relative",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
    width: "100%",
  },
});
const ImageBodyPositionsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  height: "100%",
  width: "28%",
  minWidth: "28%",
  maxWidth: "28%",
  "@media (max-width:640px)": {
    // height: "4rem",
    // width: "1rem",
    // maxHeight: "4rem",
  },
});
const InputBodyPositionsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  height: "100%",
  width: "47%",
  minWidth: "47%",
  maxWidth: "47%",
  "@media (max-width:640px)": {
    // height: "4rem",
    // width: "1rem",
    // maxHeight: "4rem",
  },
});
const CorpImageWrapper = styled(Box)({
  width: "-webkit-fill-available",
  height: "-webkit-fill-available",
  display: "flex",
  alignItems: "center",
  position: "relative",
  "&  img": {
    position: "fixed",
    width: "3rem",
    minWidth: "3rem",
  },
});
const MarginWrapper = styled(Box)({
  position: "absolute",
  bottom: "4%",
  right: "4%",
  width: "10%",
});
interface IProps {
  formKey: string | number;
  name: "primaryLeg" | "coveringLeg";
  positionType: "Options" | "Shares";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tradeState?: any;
  tradeType?: string;
  direction?: string;
  positionQuantity?: number;
  positionStrike?: number;
  positionExpiry?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  corpToken?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionToken?: any;
  positionMargin?: boolean;
  setShowFocus?: React.Dispatch<React.SetStateAction<boolean>>;
  // min: number;
  arrows: boolean;
  max: number;
  disabledIcons?: string[];
  disabledFields?: string[];
  onRangeBtnClick?: () => void;
  setValidate?: React.Dispatch<React.SetStateAction<boolean>>;
  showFocus?: boolean;
  showTrades?: boolean;
  tagCorpRef?: Ref<HTMLImageElement>;
  bgboCorpRef?: Ref<HTMLImageElement>;
  cbrtCorpRef?: Ref<HTMLImageElement>;
  edscCorpRef?: Ref<HTMLImageElement>;
  mgcrCorpRef?: Ref<HTMLImageElement>;
}
const TradesPosition = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const {
    formKey,
    name,
    tradeState,
    tradeType,
    setShowFocus,
    showFocus,
    positionType,
    // min,
    max,
    disabledIcons,
    onRangeBtnClick,
    setValidate,
    disabledFields,
    tagCorpRef,
    bgboCorpRef,
    cbrtCorpRef,
    edscCorpRef,
    mgcrCorpRef,
    arrows,
    showTrades,
    positionQuantity,
    positionStrike,
    positionExpiry,
    direction,
    corpToken,
    positionMargin,
    optionToken,
  } = props;

  // get adjusted trade datas and currentTurn from store
  const { adjust } = useAppSelector((state) => state.gamePlay);
  const { currentTurn } = useAppSelector((state) => state.game.data);
  return (
    <MainWrapper
      className={`${showTrades ? "position-screen" : "trade-screen"}`}
      ref={ref}
    >
      <HeaderWrapper>
        <h1 className="positionText">{positionType}</h1>

        <PositionImageWrapper>
          <Image
            src={
              direction
                ? direction === "long"
                  ? longToken
                  : shortToken
                : longShort
            }
            alt="long-short"
          />
        </PositionImageWrapper>
      </HeaderWrapper>
      <BodyWrapper>
        <InputBodyPositionsWrapper>
          <FormLevelInputNumber
            key={formKey}
            name={`${name}[quantity]`}
            label="Quantity :"
            step={1}
            // min={min}
            min={
              name === "coveringLeg" && tradeState
                ? tradeState["coveringLeg"].quantity
                : 1
            }
            initialValue={positionQuantity ?? 1}
            max={max}
            setShowFocus={setShowFocus}
            rangeBtn={name !== "coveringLeg"}
            rangeBtnStatus={disabledIcons}
            rangeBtnHandler={onRangeBtnClick}
            readOnly={
              showTrades ||
              name === "coveringLeg" ||
              (tradeType === "close" &&
                (tradeState["primaryLeg"].type === "put" ||
                  tradeState["primaryLeg"].type === "call"))
            }
            arrows={arrows}
            setValidate={setValidate}
          />{" "}
          {positionType === "Options" && (
            <>
              <FormLevelInputNumber
                key={!showFocus ? 2 * Date.now() : `${name}[strike]`}
                // key={`${name}[strike]`}
                name={`${name}[strike]`}
                label="Strike :"
                step={10}
                min={10}
                initialValue={positionStrike ?? 50}
                max={90}
                rangeBtn
                rangeBtnStatus={disabledIcons}
                rangeBtnHandler={onRangeBtnClick}
                setShowFocus={setShowFocus}
                readOnly={
                  // name === "coveringLeg" ||
                  showTrades ||
                  disabledFields?.includes(`${name}[strike]`) ||
                  (adjust.tradeType !== "New Trade" &&
                    !adjust.position.primaryLeg.strike) ||
                  tradeType !== "New Trade"
                }
                arrows={arrows}
                setValidate={setValidate}
              />
              <FormLevelInputNumber
                // key={`${name}[expiry]`}
                key={
                  !showFocus
                    ? `${name}[expiry] ${3 * Date.now()}`
                    : `${name}[expiry]`
                }
                name={`${name}[expiry]`}
                label="Expiry Turn:"
                step={1}
                min={currentTurn + 1}
                initialValue={positionExpiry ?? currentTurn + 1}
                setShowFocus={setShowFocus}
                max={currentTurn + 10 > 30 ? 30 : currentTurn + 10}
                rangeBtn
                rangeBtnStatus={disabledIcons}
                rangeBtnHandler={onRangeBtnClick}
                readOnly={
                  // name === "coveringLeg" ||
                  showTrades ||
                  disabledFields?.includes(`${name}[expiry]`) ||
                  (adjust.tradeType !== "New Trade" &&
                    !adjust.position.primaryLeg.expiry) ||
                  tradeType !== "New Trade"
                }
                arrows={arrows}
                setValidate={setValidate}
              />{" "}
            </>
          )}
        </InputBodyPositionsWrapper>

        <ImageBodyPositionsWrapper>
          <CorpImageWrapper>
            <Image
              src={corpToken ?? polygon}
              alt="corporation tag"
              ref={tagCorpRef}
              className="trade-tag"
            />

            {!showTrades && (
              <>
                <Image src={bgbo} alt="corporation tag" ref={bgboCorpRef} />

                <Image src={cbrt} alt="corporation tag" ref={cbrtCorpRef} />

                <Image src={edsc} alt="corporation tag" ref={edscCorpRef} />

                <Image src={mgcr} alt="corporation tag" ref={mgcrCorpRef} />
              </>
            )}
          </CorpImageWrapper>
          {positionType === "Options" && (
            <CorpImageWrapper>
              <Image
                src={optionToken ?? optionTypePolygon}
                alt="option type"
                className="trade-tag"
              />
            </CorpImageWrapper>
          )}
          {positionType === "Shares" && (
            <MarginWrapper>
              <Image
                src={positionMargin ? margin : marginCancel}
                alt="margin"
              />
            </MarginWrapper>
          )}
        </ImageBodyPositionsWrapper>
      </BodyWrapper>
    </MainWrapper>
  );
});

TradesPosition.displayName = "TradesPosition";
export default TradesPosition;
