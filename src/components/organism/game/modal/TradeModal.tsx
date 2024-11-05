"use client";

import React, { useEffect, useState } from "react";
import { useActions, useAppSelector } from "@/store/hooks";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/Modal";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";
import FormWrapper from "@/components/atoms/form/FormWrapper";
import TradeLegForm from "./TradeLegForm";
import AppButton from "@/components/atoms/buttons/AppButton";

import { ICorporation, IPositionLeg } from "@/types/interfaces/game/game";
import FormLevelInputNumber from "@/components/atoms/form/FormLevelInputNumber";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import OptionPriceModal from "./OptionPriceModal";
import optionsPriceChartJson from "@/playground_assets/options_price_chart.json";
import { IOptionPrice } from "@/types/interfaces/game/optionPrice";
import { constants } from "../gameConstants/constants";
import { useSendMessageMutation } from "@/store/api/socketApi";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import { ITradeForm } from "@/types/game/trade";

const StyledLegs = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
});

const StyleOptionChart = styled(Box)({
  position: "absolute",
  top: 50,
  right: 0,
  zIndex: 1,
});
const StyleDiv = styled(Box)({
  display: "flex",
  width: "23rem",
  justifyContent: "flex-end",
});
const StyleLabel = styled(Box)({
  display: "flex",
  width: "100%",
  placeContent: "center",
});

const StyledCoverPositionButtons = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& h3": {
    color: "red",
  },
  "& .position-cover-with": {
    display: "flex",
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (min-width:640px)": {
      maxWidth: "60vw",
    },
  },
});

const StyledErrorMessage = styled(Box)({
  color: "red",
  textAlign: "center",
});

const TradeModal = () => {
  // validate calculation of trades
  const [validate, setValidate] = useState(true);
  // const corpRef = useRef<HTMLDivElement>(null);
  // const userName = getUserInfo().userName;
  // get username from store
  const { uuid } = useAppSelector((state) => state.userInfo);

  const { isOpen, isOptionModalOpen, optionModalType } = useAppSelector(
    (state) => state.gameModal
  );
  const { closeGameModal, toggleErrorSnackbar } = useActions();
  const [sendMessage] = useSendMessageMutation();
  const { adjust } = useAppSelector((state) => state.gamePlay);
  const { corporations, roomCode, gameSettings, currentTurn, playerData } =
    useAppSelector((state) => state.game.data);
  const tradeType = adjust?.tradeType ?? "New Trade";

  const methods = useForm<ITradeForm>({
    defaultValues: {
      corporation: adjust?.position?.corporation ?? "",
      primaryLeg: {
        type: adjust?.position?.primaryLeg?.type ?? "",
        direction: adjust?.position?.primaryLeg?.direction ?? "",
        margin: adjust?.position?.primaryLeg?.margin ?? false,
        quantity: +adjust?.position?.primaryLeg?.quantity,
        strike: adjust?.position?.primaryLeg?.strike ?? 0,
        expiry: adjust?.position?.primaryLeg?.expiry ?? 0,
        price: adjust?.position?.primaryLeg?.price ?? 0,
      },
      coveringLeg: adjust.position.coveringLeg ?? null,
      payment: 0,
      buyingPower: 0,
      cashEffect: 0,
    },
  });

  const { handleSubmit, watch, setValue, getValues } = methods;

  // Form Values
  const [tradeState, setTradeState] = useState<ITradeForm>({
    corporation: adjust?.position?.corporation ?? "",
    primaryLeg: {
      type: adjust?.position?.primaryLeg?.type ?? "",
      direction: adjust?.position?.primaryLeg?.direction ?? "",
      margin: adjust?.position?.primaryLeg?.margin ?? false,
      quantity: +adjust?.position?.primaryLeg?.quantity,
      strike: adjust?.position?.primaryLeg?.strike ?? 0,
      expiry: adjust?.position?.primaryLeg?.expiry ?? 0,
      price: adjust?.position?.primaryLeg?.price ?? 0,
    },
    coveringLeg: adjust?.position?.coveringLeg ?? null,
    primaryLegPrice: 0,
    coveringLegPrice: 0,
    payment: 0,
    buyingPower: 0,
    cashEffect: 0,
  });

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(true);
  const [selectedOptionLeg, setSelectedOptionLeg] = useState("primaryLeg");
  const [showCoveringLeg, setShowCoveringLeg] = useState(
    !!adjust?.position?.coveringLeg
  );

  const corporationsDropdownKeys = Object.keys(corporations)
    .filter((corporation) => corporation !== "Global")
    .sort();
  const corporationsDropdownItems = corporationsDropdownKeys.map(
    (corporationItem) => ({
      keyName: corporationItem,
      keyValue: corporationItem,
    })
  );

  /**
   * Trade Cal
   */

  const calculateLiquidValue = (corporation: string, leg: IPositionLeg) => {
    let liquidValue = 0;
    const currentPrice = corporations[corporation].price;
    if (leg.type === "shares") {
      liquidValue = leg.quantity * currentPrice;
      if (leg.margin && leg.direction === "long") {
        liquidValue = liquidValue / 2;
      }
    } else {
      const optionsPriceChart: IOptionPrice = optionsPriceChartJson;
      const strike = leg.strike || 0;
      const expiry = leg.expiry || 0;
      const turnsTillExpiry = expiry - currentTurn;

      if (turnsTillExpiry > 0) {
        const callPrice =
          optionsPriceChart[strike]?.[currentPrice]?.[turnsTillExpiry]?.[
            "call"
          ];

        const putPrice =
          optionsPriceChart[strike]?.[currentPrice]?.[turnsTillExpiry]?.["put"];
        if (leg.type === "call") {
          liquidValue = leg.quantity * callPrice;
        } else {
          liquidValue = leg.quantity * putPrice;
        }
      }
    }

    if (leg.direction === "short") {
      liquidValue = liquidValue * -1;
    }

    if (tradeType === "close") {
      liquidValue = liquidValue * -1;
    }

    return liquidValue;
  };

  const calculateBuyingPower = () => {
    const { corporation, primaryLeg, coveringLeg } = tradeState;
    if (
      corporation &&
      primaryLeg.type &&
      primaryLeg.direction &&
      primaryLeg.quantity
    ) {
      if (
        // short shares on primary leg
        primaryLeg.type === "shares" &&
        primaryLeg.direction === "short" &&
        gameSettings["Margin Maintenance"] === "On"
      ) {
        return -1.5 * calculateLiquidValue(corporation, primaryLeg);
      }

      if (gameSettings["Naked Shorting"] == "Off") {
        if (
          // cash secured puts
          primaryLeg.type === "put" &&
          primaryLeg.direction === "short" &&
          primaryLeg.strike &&
          primaryLeg.expiry &&
          coveringLeg === null
        ) {
          return (
            100 *
            primaryLeg.strike *
            primaryLeg.quantity *
            (tradeType === "close" ? -1 : 1)
          );
        }
        if (
          // covered puts
          primaryLeg.type === "put" &&
          primaryLeg.direction === "short" &&
          primaryLeg.strike &&
          primaryLeg.expiry &&
          coveringLeg !== null &&
          coveringLeg.type === "shares" &&
          coveringLeg.direction === "short" &&
          coveringLeg.quantity &&
          gameSettings["Margin Maintenance"] === "On"
        ) {
          return (
            100 *
              primaryLeg.strike *
              primaryLeg.quantity *
              (tradeType === "close" ? -1 : 1) -
            1.5 * calculateLiquidValue(corporation, coveringLeg)
          );
        }
        if (
          // credit spreads
          primaryLeg.type !== "shares" &&
          primaryLeg.direction === "short" &&
          primaryLeg.strike &&
          primaryLeg.expiry &&
          coveringLeg &&
          coveringLeg.type &&
          coveringLeg.direction === "long" &&
          coveringLeg.quantity &&
          coveringLeg.strike &&
          coveringLeg.expiry &&
          Math.abs(calculateLiquidValue(corporation, coveringLeg)) <
            Math.abs(calculateLiquidValue(corporation, primaryLeg))
        ) {
          return (
            100 *
            Math.abs(coveringLeg.strike - primaryLeg.strike) *
            coveringLeg.quantity *
            (tradeType === "close" ? -1 : 1)
          );
        }
      }
    }
    return null;
  };
  const calculateTrade = () => {
    const {
      corporation,
      primaryLeg,
      coveringLeg,
      // coveringLegPrice,
      buyingPower,
      payment,
      cashEffect,
    } = tradeState;

    if (!validate) return;

    const liquidValuePrimaryLeg =
      -1 * calculateLiquidValue(corporation, primaryLeg);
    if (primaryLeg.price !== liquidValuePrimaryLeg) {
      setValue("primaryLeg.price", liquidValuePrimaryLeg);
    }

    let liquidValueCoveringLeg = 0;
    if (coveringLeg && coveringLeg.type) {
      liquidValueCoveringLeg =
        -1 * calculateLiquidValue(corporation, coveringLeg);
      if (coveringLeg.price !== liquidValueCoveringLeg) {
        setValue("coveringLeg.price", liquidValueCoveringLeg);
      }
    }

    const newBuyingPower = calculateBuyingPower() ?? 0; // buying power that you add or withdraw that is tied to the position
    const newPayment = liquidValuePrimaryLeg + liquidValueCoveringLeg; // what you pay the bank or the bank pays you
    const newCashEffect = newPayment - newBuyingPower; // net cash effect for the trade (cash -= LV1 + LV2 + BP)

    if (newBuyingPower !== buyingPower) {
      setValue("buyingPower", newBuyingPower);
    }

    if (newPayment !== payment) {
      setValue("payment", newPayment);
    }

    if (newCashEffect !== cashEffect) {
      setValue("cashEffect", newCashEffect);
    }
  };

  /** Trade Cal end */
  const handleUndefinedStateValue = (
    prevState: IPositionLeg | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newState: any
  ) => {
    const localNewState = { ...newState };

    Object.entries(localNewState).map((stateItem) => {
      const fieldName = stateItem[0] as keyof IPositionLeg;

      if (stateItem.includes(undefined)) {
        localNewState[stateItem[0]] = prevState
          ? prevState[fieldName]
          : stateItem[1];
      }
    });

    return localNewState;
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const {
        corporation,
        primaryLeg,
        coveringLeg,
        payment,
        buyingPower,
        cashEffect,
      } = value;
      // corporation change
      if (name === "corporation") {
        const corporationKey = value[name] as keyof ICorporation;
        setValue(
          "primaryLegPrice",
          corporationKey ? +corporations[corporationKey].price : 0
        );
        setValue(
          "coveringLegPrice",
          corporationKey ? +corporations[corporationKey].price * 100 : 0
        );
      }

      if (
        (name?.includes("direction") || name?.includes("type")) &&
        primaryLeg?.type === "shares" &&
        primaryLeg?.direction === "short"
      ) {
        // setValue("primaryLeg.margin", true);  TODO: remember to ask
        setValue("primaryLeg.expiry", 0);
        setValue("primaryLeg.strike", 0);
        setValue("coveringLeg", null);
        setTradeState((prevState) => ({
          ...prevState,
          coveringLeg: null,
        }));
      }

      if (
        (name?.includes("direction") || name?.includes("type")) &&
        primaryLeg?.type !== "shares"
      ) {
        setValue("primaryLeg.margin", false);
      }

      // quantity change
      if (
        name?.includes("primaryLeg") &&
        name?.includes("quantity") &&
        primaryLeg?.quantity &&
        tradeState?.coveringLeg
      ) {
        const setCoveringLegPrice =
          tradeState?.coveringLeg?.type === "shares"
            ? 100 * primaryLeg.quantity
            : primaryLeg.quantity;

        setValue("coveringLeg.quantity", setCoveringLegPrice);
      }

      if (
        name?.includes("primaryLeg") &&
        name?.includes("expiry") &&
        primaryLeg?.expiry &&
        tradeState?.coveringLeg
      ) {
        if (!!coveringLeg && coveringLeg?.expiry) {
          if (primaryLeg?.expiry >= coveringLeg?.expiry) {
            // setValue("coveringLeg.expiry", primaryLeg?.expiry);
          }
        }
      }

      // Unset Covering Leg
      if (
        (name?.includes("primaryLeg") &&
          name?.includes("type") &&
          primaryLeg?.type) ||
        primaryLeg?.direction === "long"
      ) {
        setShowCoveringLeg(false);
      }

      if (
        name?.includes("primaryLeg") &&
        name?.includes("quantity") &&
        primaryLeg?.quantity &&
        primaryLeg?.quantity <= 0
      ) {
        setShowCoveringLeg(false);
      }

      // if (
      //   primaryLeg?.strike &&
      //   coveringLeg &&
      //   coveringLeg?.strike !== primaryLeg?.strike &&
      //   (coveringLeg?.type === "call" || coveringLeg?.type === "put")
      // ) {
      //   setValue("coveringLeg.strike", primaryLeg?.strike);
      // }
      if (name && value) {
        setTradeState((prevState) => ({
          ...prevState,
          corporation: corporation ?? "",
          primaryLeg: {
            ...prevState.primaryLeg,
            ...handleUndefinedStateValue(
              prevState.primaryLeg,
              primaryLeg as IPositionLeg
            ),
          },
          coveringLeg: prevState.coveringLeg
            ? {
                ...prevState.coveringLeg,
                ...handleUndefinedStateValue(
                  prevState?.coveringLeg,
                  coveringLeg as IPositionLeg
                ),
              }
            : null,
          payment: payment ?? 0,
          buyingPower: buyingPower ?? 0,
          cashEffect: cashEffect ?? 0,
        }));
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, tradeState, validate]);

  useEffect(() => {
    const { corporation, primaryLeg, coveringLeg } = tradeState;
    // console.log(
    //   primaryLeg.type,
    //   primaryLeg.direction,
    //   primaryLeg.margin,
    //   tradeState.primaryLeg.expiry,
    //   tradeState.primaryLeg.strike,
    //   coveringLeg
    // );

    if (
      corporation &&
      primaryLeg?.type &&
      primaryLeg?.direction &&
      primaryLeg?.quantity &&
      // long shares
      ((primaryLeg.type === "shares" &&
        primaryLeg.direction === "long" &&
        // primaryLeg.expiry === 0 &&
        // primaryLeg.strike === 0 &&
        coveringLeg === null) ||
        // short shares
        (primaryLeg.type === "shares" &&
          primaryLeg.direction === "short" &&
          primaryLeg.margin === true &&
          // primaryLeg.expiry === 0 &&
          // primaryLeg.strike === 0 &&
          coveringLeg === null) ||
        // long call
        (primaryLeg.type === "call" &&
          primaryLeg.direction === "long" &&
          primaryLeg.margin === false &&
          !!tradeState.primaryLeg.expiry &&
          !!tradeState.primaryLeg.strike &&
          coveringLeg === null) ||
        // long put
        (primaryLeg.type === "put" &&
          primaryLeg.direction === "long" &&
          primaryLeg.margin === false &&
          !!tradeState.primaryLeg.expiry &&
          !!tradeState.primaryLeg.strike &&
          coveringLeg === null) ||
        // call spread
        (primaryLeg.type === "call" &&
          primaryLeg.direction === "short" &&
          primaryLeg.margin === false &&
          !!primaryLeg.expiry &&
          !!primaryLeg.strike &&
          coveringLeg !== null &&
          coveringLeg.type === "call" &&
          coveringLeg.direction === "long" &&
          coveringLeg.margin === false &&
          !!coveringLeg.quantity &&
          coveringLeg.quantity === primaryLeg.quantity &&
          !!coveringLeg.expiry &&
          coveringLeg.expiry >= primaryLeg.expiry &&
          !!coveringLeg.strike) ||
        // covered call
        (primaryLeg.type === "call" &&
          primaryLeg.direction === "short" &&
          primaryLeg.margin === false &&
          !!primaryLeg.expiry &&
          !!primaryLeg.strike &&
          coveringLeg !== null &&
          coveringLeg.type === "shares" &&
          coveringLeg.direction === "long" &&
          !!coveringLeg.quantity &&
          coveringLeg.quantity === 100 * primaryLeg.quantity) ||
        // &&
        // coveringLeg.expiry === 0 &&
        // coveringLeg.strike === 0
        // put spread
        (primaryLeg.type === "put" &&
          primaryLeg.direction === "short" &&
          primaryLeg.margin === false &&
          !!primaryLeg.expiry &&
          !!primaryLeg.strike &&
          coveringLeg !== null &&
          coveringLeg.type === "put" &&
          coveringLeg.direction === "long" &&
          coveringLeg.margin === false &&
          !!coveringLeg.quantity &&
          coveringLeg.quantity === primaryLeg.quantity &&
          !!coveringLeg.expiry &&
          coveringLeg.expiry >= primaryLeg.expiry &&
          !!coveringLeg.strike) ||
        // cash secured put
        (primaryLeg.type === "put" &&
          primaryLeg.direction === "short" &&
          primaryLeg.margin === false &&
          !!primaryLeg.expiry &&
          !!primaryLeg.strike &&
          coveringLeg === null) ||
        // covered put
        (primaryLeg.type === "put" &&
          primaryLeg.direction === "short" &&
          primaryLeg.margin === false &&
          !!primaryLeg.expiry &&
          !!primaryLeg.strike &&
          coveringLeg !== null &&
          coveringLeg.type === "shares" &&
          coveringLeg.direction === "short" &&
          coveringLeg.margin === true &&
          !!coveringLeg.quantity &&
          coveringLeg.quantity === 100 * primaryLeg.quantity))
      // &&
      // !!coveringLeg.expiry &&
      // !!coveringLeg.strike
    ) {
      if (
        primaryLeg?.strike === coveringLeg?.strike &&
        primaryLeg?.expiry === coveringLeg?.expiry
      ) {
        toggleErrorSnackbar({
          message: "Strike and expiry can’t both be the same as primary leg",
        });
        setIsReadyToSubmit(true);
        return;
      }

      setIsReadyToSubmit(false);

      // console.log("false");
      calculateTrade();
    } else {
      // console.log("true");

      setIsReadyToSubmit(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeState, validate]);

  const handleClose = () => {
    closeGameModal();
  };
  const handleTrade = () => {
    const { corporation, primaryLeg, coveringLeg, buyingPower } = tradeState;

    const tradeRequest = {
      corporation,
      primaryLeg,
      coveringLeg,
      buyingPower,
    };

    tradeRequest.primaryLeg.quantity =
      tradeType === "close" ? -1 * primaryLeg.quantity : primaryLeg.quantity;

    if (
      tradeRequest?.coveringLeg !== null &&
      tradeRequest?.coveringLeg?.quantity
    ) {
      tradeRequest.coveringLeg.quantity =
        tradeType === "close"
          ? -1 * tradeRequest.coveringLeg.quantity
          : tradeRequest.coveringLeg.quantity;
    }

    if (tradeRequest?.primaryLeg?.type === "shares") {
      tradeRequest.primaryLeg.strike = null;
      tradeRequest.primaryLeg.expiry = null;
    }

    if (tradeRequest?.coveringLeg?.type === "shares") {
      tradeRequest.coveringLeg.strike = null;
      tradeRequest.coveringLeg.expiry = null;
    }
    // Remove the price key from primaryLeg
    delete tradeRequest.primaryLeg.price;

    sendMessage({
      action: constants.trade_action,
      payload: { tradeRequest, roomCode: roomCode },
    });

    setTimeout(() => {
      closeGameModal();
    }, 0);
  };

  const handleRangeButton = (
    value: number,
    range: {
      min: number;
      max: number;
      step: number;
    },
    eventType: string,
    eventName: string
  ) => {
    const fieldName = eventName as keyof ITradeForm;

    if (fieldName && eventType === "plus") {
      if (+value < range.max) {
        setValue(fieldName, +value + range.step);
      }
    } else if (fieldName && eventType === "minus" && value) {
      if (+value > range.min) {
        setValue(fieldName, +value - range.step);
      }
    }
  };

  const coverWithShares = () => {
    const coveringLegValue = {
      type: "shares",
      direction: tradeState.primaryLeg.type === "put" ? "short" : "long",
      margin: tradeState.primaryLeg.type === "put",
      quantity: tradeState.primaryLeg.quantity * 100,
      strike: 0,
      expiry: 0,
      price: 0,
    };
    setValue("coveringLeg", coveringLegValue);
    setTradeState((prevState) => ({
      ...prevState,
      coveringLeg: {
        ...prevState.coveringLeg,
        ...coveringLegValue,
      },
    }));
    setShowCoveringLeg(true);
  };

  const coverWithLongOptions = () => {
    const { primaryLeg } = getValues();
    const newStrike = primaryLeg.strike ?? 50;
    const newExpiry = primaryLeg.expiry && primaryLeg.expiry + 1;

    // if (coveringLeg && coveringLeg.strike) {
    //   newStrike = coveringLeg.strike;
    // }

    // if (coveringLeg && coveringLeg.expiry) {
    //   newExpiry = coveringLeg.expiry;
    // }

    const coveringLegValue = {
      type: primaryLeg.type,
      direction: "long",
      margin: false,
      quantity: primaryLeg.quantity,
      strike: +newStrike,
      expiry: newExpiry,
      price: 0,
    };

    setValue("coveringLeg", coveringLegValue);
    setTradeState((prevState) => ({
      ...prevState,
      coveringLeg: {
        ...prevState.coveringLeg,
        ...coveringLegValue,
      },
    }));
    setShowCoveringLeg(true);
  };

  const coverWithCash = () => {
    setValue("coveringLeg", null);
    setShowCoveringLeg(false);
  };

  const setOptionPriceFromChart = (
    type: string,
    strike: number,
    expiry: number
  ) => {
    if (selectedOptionLeg) {
      const optionLegType = selectedOptionLeg as keyof ITradeForm;
      const localTradeState = tradeState[optionLegType] as IPositionLeg;

      const leg = {
        ...localTradeState,
        type: type,
        direction: localTradeState.direction ?? "long",
        margin: !!localTradeState.margin,
        quantity: localTradeState.quantity ?? 1,
        strike: strike,
        expiry: expiry + currentTurn,
      };
      setValue(optionLegType, leg);
      setTradeState((prevState) => ({
        ...prevState,
        [optionLegType]: {
          ...leg,
        },
      }));
    }
  };

  const setOptionPriceLeg = (type: string) => {
    setSelectedOptionLeg(type);
  };

  return (
    <>
      <Modal open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <ModalBody id="trade-modal">
          <ModalTitle onClose={handleClose}>
            {tradeType.toUpperCase()}
          </ModalTitle>
          <FormWrapper
            methods={methods}
            id="trade-form"
            onSubmit={handleSubmit(handleTrade)}
          >
            <Typography sx={{ textAlign: "center" }}>
              Choose the corporation
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Box
                className="position-type-buttons"
                onClick={()=>setValue("corporation","chinedu")}
              >
                test
              </Box> */}
              {corporationsDropdownItems.map((corporation, i) => (
                <Box
                  className={`position-type-buttons  ${
                    corporation.keyName === tradeState.corporation
                      ? "selected"
                      : ""
                  }`}
                  id={corporation.keyName}
                  sx={{
                    zIndex: "1000",
                    transition: "all 0.7s ease",
                  }}
                  onClick={() => {
                    if (tradeType !== "New Trade") return;
                    setValue("corporation", corporation.keyName);
                  }}
                  key={i}
                  // ref={corpRef[i]}
                >
                  <Image
                    src={`/images/positions/${corporation.keyName}.webp`}
                    alt={`${corporation.keyName}`}
                    width={50}
                    height={50}
                  />
                  {/* {corporation.keyName} */}
                </Box>
              ))}
              {/* <FormLevelDropdown
                name="corporation"
                label="Corporation :"
                placeholder="Select corporation"
                dropDownItem={corporationsDropdownItems}
                // disabled={!!adjust?.position?.corporation}
              /> */}
            </Box>
            {tradeState.corporation &&
              tradeState.primaryLeg.type &&
              tradeState.primaryLeg.direction === "short" &&
              !!tradeState.primaryLeg.quantity &&
              !!tradeState.primaryLeg.strike &&
              !!tradeState.primaryLeg.expiry &&
              gameSettings["Naked Shorting"] === "Off" &&
              (tradeState.primaryLeg.type === "put" ||
                tradeState.primaryLeg.type === "call") && (
                <StyledCoverPositionButtons>
                  <h3>Short Options Must Be Covered</h3>
                  {tradeType !== "close" && (
                    <Box className="position-cover-with">
                      <h4>Cover with:</h4>
                      {tradeState.primaryLeg.type === "call" && (
                        <AppButton
                          variant="contained"
                          color="primary"
                          onClick={coverWithShares}
                        >
                          {/* {tradeState.primaryLeg.type === "put"
                          ? "Short Shares"
                          : "Long Shares"} */}
                          Long Shares
                        </AppButton>
                      )}
                      {(tradeState.primaryLeg.type === "call" ||
                        tradeState.primaryLeg.type === "put") && (
                        <AppButton
                          variant="contained"
                          color="primary"
                          onClick={coverWithLongOptions}
                        >
                          {tradeState.primaryLeg.type === "put"
                            ? "Long Put"
                            : "Long Call"}
                          {/* Long Call */}
                        </AppButton>
                      )}
                      {tradeState.primaryLeg.type === "put" && (
                        <AppButton
                          variant="contained"
                          color="primary"
                          onClick={coverWithCash}
                        >
                          Cash
                        </AppButton>
                      )}
                    </Box>
                  )}
                </StyledCoverPositionButtons>
              )}
            <StyledLegs>
              <TradeLegForm
                title="Primary Leg"
                name="primaryLeg"
                tradeState={tradeState}
                legState={tradeState?.primaryLeg}
                onRangeBtnClick={handleRangeButton}
                onOptionPriceChartClick={setOptionPriceLeg}
                hookWatch={watch}
                corporation={tradeState.corporation}
                setValue={setValue}
                setValidate={setValidate}
              />
              {showCoveringLeg && (
                <TradeLegForm
                  title="Covering Leg"
                  name="coveringLeg"
                  tradeState={tradeState}
                  legState={tradeState?.coveringLeg}
                  onRangeBtnClick={handleRangeButton}
                  onOptionPriceChartClick={setOptionPriceLeg}
                  hookWatch={watch}
                  corporation={tradeState.corporation}
                  setValue={setValue}
                  setValidate={setValidate}
                />
              )}
            </StyledLegs>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StyleDiv>
                <StyleLabel style={{ fontWeight: "bold" }}>
                  {tradeState.payment <= 0
                    ? "You Pay The Bank"
                    : "Bank Pays You"}
                </StyleLabel>
                <FormLevelInputNumber
                  name="payment"
                  // label={
                  //   tradeState.payment <= 0 ? "You Pay The Bank" : "Bank Pays You"
                  // }

                  setValidate={setValidate}
                  currency
                  readOnly
                />
              </StyleDiv>
              <StyleDiv>
                <StyleLabel>
                  {tradeState.buyingPower < 0
                    ? "You Withdraw From Buying Power"
                    : "You Add To Buying Power"}
                </StyleLabel>
                <FormLevelInputNumber
                  name="buyingPower"
                  // label={
                  //   tradeState.buyingPower < 0
                  //     ? "You Withdraw From Buying Power"
                  //     : "You Add To Buying Power"
                  // }

                  setValidate={setValidate}
                  currency
                  readOnly
                />
              </StyleDiv>
              <StyleDiv>
                <StyleLabel>Net Cash Effect </StyleLabel>
                <FormLevelInputNumber
                  name="cashEffect"
                  // label="Net Cash Effect"
                  style={{
                    width: "40rem",
                  }}
                  setValidate={setValidate}
                  currency
                  readOnly
                />
              </StyleDiv>
              <StyledErrorMessage>
                {playerData[uuid.userID].cash + tradeState.cashEffect < 0 &&
                tradeState.cashEffect < 0
                  ? "Not enough cash to place trade"
                  : ""}
              </StyledErrorMessage>
              <AppButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={
                  isReadyToSubmit ||
                  !validate ||
                  (playerData[uuid.userID].cash + tradeState.cashEffect < 0 &&
                    tradeState.cashEffect < 0)
                }
              >
                Place Trade
              </AppButton>
            </Box>
          </FormWrapper>
        </ModalBody>
      </Modal>
      <StyleOptionChart>
        {isOptionModalOpen && optionModalType === "option" && (
          <OptionPriceModal
            legType={selectedOptionLeg}
            legState={tradeState.primaryLeg}
            corporation={tradeState.corporation}
            optionPriceHandler={setOptionPriceFromChart}
          />
        )}
      </StyleOptionChart>
    </>
  );
};

export default TradeModal;
