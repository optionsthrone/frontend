"use client";

import React from "react";
import "./position.css";
import edscToken from "../../../../playground_assets/position card tokens/EDSC token.png";
import cbrtToken from "../../../../playground_assets/position card tokens/CBRT token.png";
import bgboToken from "../../../../playground_assets/position card tokens/BGBO token.png";
import mgcrToken from "../../../../playground_assets/position card tokens/MGCR token.png";
import callToken from "../../../../playground_assets/position card tokens/Call.png";
import putToken from "../../../../playground_assets/position card tokens/Put.png";
import optionsPriceChartJson from "@/playground_assets/options_price_chart.json";
import { IGame, IPosition, IPositionLeg } from "@/types/interfaces/game/game";
import { Box, styled } from "@mui/material";
import { IOptionPrice } from "@/types/interfaces/game/optionPrice";
import TradesPosition from "@/components/atoms/positions/tradePosition";
import FormWrapper from "@/components/atoms/form/FormWrapper";
import { useForm } from "react-hook-form";

const PositionWrapper = styled(Box)({
  padding: "0.3rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  //   width: "10rem",
  fontSize: "0.6rem",
  "@media (max-width:640px)": {
    // width: "50vw",
    // height: "25vh",
    // writingMode: "tb-rl",
    // transform: "rotate(-180deg)",
    // overflowX: "auto",
    // justifyContent: "start",
    padding: "0.4rem 0",
  },
});
const SalesWrapper = styled(Box)({
  padding: "0.3rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  width: "min(100%, 13rem)",
  fontSize: "0.6rem",
  "@media (max-width:640px)": {
    // flexDirection: "column",
    // height: "100dvh",
    // Padding: "0.4rem",
  },
});

interface IProps {
  position: IPosition;
  gameState: IGame;
}
type IStrike = "10" | "20" | "30" | "40" | "50" | "60" | "70" | "80" | "90";
type ICurrentPrice = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
type ITurnsTillExpiry = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

function Position({ position, gameState }: IProps) {
  // form methods
  const methods = useForm();

  const optionsPriceChart: IOptionPrice = optionsPriceChartJson;
  const calculateLiquidValue = (corporation: string, leg: IPositionLeg) => {
    let liquidValue = 0;
    const currentTurn = gameState.currentTurn;
    const currentPrice = gameState.corporations[corporation]
      .price as unknown as ICurrentPrice;
    if (leg.type === "shares") {
      liquidValue = leg.quantity * currentPrice;
      if (leg.margin && leg.direction === "long") {
        liquidValue = liquidValue / 2;
      }
    } else {
      const strike = leg.strike as unknown as IStrike;
      const expiry = leg.expiry;
      if (!strike) return 0;
      if (!expiry) return 0;
      const te = expiry - currentTurn;
      const turnsTillExpiry = te as unknown as ITurnsTillExpiry;
      const callPrice =
        optionsPriceChart[strike][currentPrice][turnsTillExpiry].call;
      const putPrice =
        optionsPriceChart[strike][currentPrice][turnsTillExpiry]["put"];
      if (leg.type === "call") {
        liquidValue = leg.quantity * callPrice;
      } else {
        liquidValue = leg.quantity * putPrice;
      }
    }

    if (leg.direction === "short") {
      liquidValue = liquidValue * -1;
    }

    return liquidValue;
  };

  // display long or short image
  // let primaryLongOrShort;
  // switch (position.primaryLeg.direction) {
  //   case "long":
  //     primaryLongOrShort = longToken;
  //     break;
  //   case "short":
  //     primaryLongOrShort = shortToken;
  //     break;
  // }

  // display corp token
  let corpToken;
  switch (position.corporation) {
    case "BGBO":
      corpToken = bgboToken;
      break;
    case "CBRT":
      corpToken = cbrtToken;
      break;
    case "EDSC":
      corpToken = edscToken;
      break;
    case "MGCR":
      corpToken = mgcrToken;
      break;
  }

  return (
    <>
      {/* Primary Leg */}
      <PositionWrapper>
        {" "}
        <SalesWrapper>
          Sale Value:{" "}
          {(() => {
            const value =
              calculateLiquidValue(position.corporation, position.primaryLeg) +
              (position.coveringLeg
                ? calculateLiquidValue(
                    position.corporation,
                    position.coveringLeg
                  )
                : 0);
            const formattedValue = Math.abs(value)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return value < 0 ? `-$${formattedValue}` : `$${formattedValue}`;
          })()}
        </SalesWrapper>
        <FormWrapper methods={methods} id="open-positions" onSubmit={() => {}}>
          <TradesPosition
            formKey={`${Date.now()}Position`}
            name={"primaryLeg"}
            positionType={
              position.primaryLeg.type.charAt(0).toUpperCase() +
                position.primaryLeg.type.slice(1) ===
              "Shares"
                ? "Shares"
                : "Options"
            }
            max={10}
            showTrades={true}
            positionQuantity={position.primaryLeg.quantity}
            positionStrike={position.primaryLeg.strike ?? undefined}
            positionExpiry={position.primaryLeg.expiry ?? undefined}
            // min={min}
            direction={position.primaryLeg.direction}
            corpToken={corpToken}
            positionMargin={position.primaryLeg.margin}
            optionToken={
              position.primaryLeg.type === "call"
                ? callToken
                : position.primaryLeg.type === "put"
                ? putToken
                : undefined
            }
            arrows={false}
          />
        </FormWrapper>
        {/* <SharesWrapper>
          <h1>
            {position.primaryLeg.type.charAt(0).toUpperCase() +
              position.primaryLeg.type.slice(1)}
          </h1>
          {primaryLongOrShort && (
            <PositionImageWrapper>
              <Image
                src={primaryLongOrShort}
                alt="Long Token"
                // className="direction-token-primary"
              />{" "}
            </PositionImageWrapper>
          )}
        </SharesWrapper>
        <CorpsWrapper>
          <FormControl style={{ fontSize: "0.4rem", width: "100%" }}>
            {position.primaryLeg.quantity && (
              <>
                <FormLabel
                  style={{
                    color: "white",
                    fontSize: "0.6rem",
                    marginTop: "0.4rem",
                  }}
                >
                  Quantity :
                </FormLabel>
                <InputTextfield
                  disabled
                  value={position.primaryLeg.quantity.toLocaleString()}
                  inputProps={{
                    style: {
                      fontSize: "0.7rem",
                      height: "1rem",
                      maxHeight: "1rem",
                      padding: 0,
                      fontWeight: "bold",
                      color: "black",
                      WebkitTextFillColor: "black",
                    },
                  }}
                  // style={{

                  // }}
                />{" "}
              </>
            )}
            {position.primaryLeg.strike && (
              <>
                <FormLabel
                  style={{
                    color: "white",
                    fontSize: "0.6rem",
                    marginTop: "0.4rem",
                  }}
                >
                  Strike
                </FormLabel>
                <InputTextfield
                  disabled
                  value={position.primaryLeg.strike}
                  inputProps={{
                    style: {
                      fontSize: "0.7rem",
                      height: "1rem",
                      maxHeight: "1rem",
                      padding: 0,
                      fontWeight: "bold",
                      color: "black",
                      WebkitTextFillColor: "black",
                    },
                  }}
                />{" "}
              </>
            )}
            {position.primaryLeg.expiry && (
              <>
                <FormLabel
                  style={{
                    color: "white",
                    fontSize: "0.6rem",
                    marginTop: "0.4rem",
                  }}
                >
                  Expiry Type
                </FormLabel>
                <InputTextfield
                  disabled
                  value={position.primaryLeg.expiry}
                  inputProps={{
                    style: {
                      fontSize: "0.7rem",
                      height: "1rem",
                      maxHeight: "1rem",
                      padding: 0,
                      fontWeight: "bold",
                      color: "black",
                      WebkitTextFillColor: "black",
                    },
                  }}
                />{" "}
              </>
            )}
          </FormControl>
          <ColImageWrapper>
            <ImageWrapper>
              {corpToken && (
                <Image
                  src={corpToken}
                  alt="Corp Token"
                  // className={
                  //   position.primaryLeg.type === "shares"
                  //     ? "corp-token-shares-primary"
                  //     : "corp-token-options-primary"
                  // }
                />
              )}
            </ImageWrapper>
            {(position.primaryLeg.type === "call" ||
              position.primaryLeg.type === "put") && (
              <ImageWrapper>
                {position.primaryLeg.type === "call" && (
                  <Image
                    src={callToken}
                    alt="Call Token"
                    // className="options-token-primary"
                  />
                )}
                {position.primaryLeg.type === "put" && (
                  <Image
                    src={putToken}
                    alt="Put Token"
                    // className="options-token-primary"
                  />
                )}
              </ImageWrapper>
            )}
          </ColImageWrapper>
          <MarginWrapper>
            {position.primaryLeg.margin ? (
              <MarginImageWrapper>
                <Image
                  src={marginToken}
                  alt="Margin Token"
                  // className="margin-token-primary"
                />
              </MarginImageWrapper>
            ) : (
              <MarginImageWrapper>
                <Image
                  src={marginCancelToken}
                  alt="Margin Token"
                  // className="margin-token-primary"
                />
              </MarginImageWrapper>
            )}
          </MarginWrapper>{" "}
        </CorpsWrapper> */}
      </PositionWrapper>
      {/* Covering Leg */}

      {position.coveringLeg && (
        <PositionWrapper>
          <FormWrapper
            methods={methods}
            id="open-positions"
            onSubmit={() => {}}
          >
            <TradesPosition
              formKey={`${Date.now()}Position`}
              name={"coveringLeg"}
              positionType={
                position.coveringLeg.type.charAt(0).toUpperCase() +
                  position.coveringLeg.type.slice(1) ===
                "Shares"
                  ? "Shares"
                  : "Options"
              }
              max={10}
              showTrades={true}
              positionQuantity={position.coveringLeg.quantity}
              positionStrike={position.coveringLeg.strike ?? undefined}
              positionExpiry={position.coveringLeg.expiry ?? undefined}
              // min={min}
              direction={position.coveringLeg.direction}
              corpToken={corpToken}
              optionToken={
                position.primaryLeg.type === "call"
                  ? callToken
                  : position.primaryLeg.type === "put"
                  ? putToken
                  : undefined
              }
              positionMargin={position.coveringLeg.margin}
              arrows={false}
            />
          </FormWrapper>
          {/* <SharesWrapper>
            <h1>Shares</h1>
            {position.coveringLeg.direction === "long" ? (
              <PositionImageWrapper>
                <Image
                  src={longToken}
                  alt="Long Token"
                  // className="direction-token-primary"
                />{" "}
              </PositionImageWrapper>
            ) : (
              <PositionImageWrapper>
                <Image
                  src={shortToken}
                  alt="Short Token"
                  // className="direction-token-primary"
                />{" "}
              </PositionImageWrapper>
            )}
          </SharesWrapper>
          <CorpsWrapper>
            <FormControl style={{ fontSize: "0.4rem", width: "100%" }}>
              {position.coveringLeg.quantity && (
                <>
                  <FormLabel
                    style={{
                      color: "white",
                      fontSize: "0.6rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    Quantity :
                  </FormLabel>
                  <InputTextfield
                    disabled
                    value={position.coveringLeg.quantity}
                    inputProps={{
                      style: {
                        fontSize: "0.7rem",
                        height: "1rem",
                        maxHeight: "1rem",
                        padding: 0,
                        fontWeight: "bold",
                        color: "black",
                        WebkitTextFillColor: "black",
                      },
                    }}
                  />{" "}
                </>
              )}
              {position.coveringLeg.strike && (
                <>
                  <FormLabel
                    style={{
                      color: "white",
                      fontSize: "0.6rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    Strike
                  </FormLabel>
                  <InputTextfield
                    disabled
                    value={position.coveringLeg.strike}
                    inputProps={{
                      style: {
                        fontSize: "0.7rem",
                        height: "1rem",
                        maxHeight: "1rem",
                        padding: 0,
                        fontWeight: "bold",
                        color: "black",
                        WebkitTextFillColor: "black",
                      },
                    }}
                  />{" "}
                </>
              )}
              {position.coveringLeg.expiry && (
                <>
                  <FormLabel
                    style={{
                      color: "white",
                      fontSize: "0.6rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    Expiry Type
                  </FormLabel>
                  <InputTextfield
                    disabled
                    value={position.coveringLeg.expiry}
                    inputProps={{
                      style: {
                        fontSize: "0.7rem",
                        height: "1rem",
                        maxHeight: "1rem",
                        padding: 0,
                        fontWeight: "bold",
                        color: "black",
                        WebkitTextFillColor: "black",
                      },
                    }}
                  />{" "}
                </>
              )}
            </FormControl>
            <ColImageWrapper>
              <ImageWrapper>
                {corpToken && (
                  <Image
                    src={corpToken}
                    alt="Corp Token"
                    // className={
                    //   position.coveringLeg.type === "shares"
                    //     ? "corp-token-shares-primary"
                    //     : "corp-token-options-primary"
                    // }
                  />
                )}
              </ImageWrapper>
              {(position.coveringLeg.type === "call" ||
                position.coveringLeg.type === "put") && (
                <ImageWrapper>
                  {position.coveringLeg.type === "call" && (
                    <Image
                      src={callToken}
                      alt="Call Token"
                      // className="options-token-primary"
                    />
                  )}
                  {position.coveringLeg.type === "put" && (
                    <Image
                      src={putToken}
                      alt="Put Token"
                      // className="options-token-primary"
                    />
                  )}
                </ImageWrapper>
              )}
            </ColImageWrapper>{" "}
            <MarginWrapper>
              {position.coveringLeg.margin ? (
                <MarginImageWrapper>
                  <Image
                    src={marginToken}
                    alt="Margin Token"
                    // className="margin-token-primary"
                  />
                </MarginImageWrapper>
              ) : (
                <MarginImageWrapper>
                  <Image
                    src={marginCancelToken}
                    alt="Margin Token"
                    // className="margin-token-primary"
                  />
                </MarginImageWrapper>
              )}
            </MarginWrapper>
          </CorpsWrapper> */}
        </PositionWrapper>
      )}
    </>
  );
}

export default Position;
