"use client";
import React, { useState, useEffect, memo, useCallback } from "react";
import Image from "next/image";
import TrendChart from "./trendChart";
import { ICorporationBlock } from "@/types/interfaces/boardPiece/boardpiece";
import RandomWave from "./randomWave";
import AbilityBg from "./abilityBG";
import ActiveEvents from "./activeEvents";
import { useActions, useAppSelector } from "@/store/hooks";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { constants } from "../game/gameConstants/constants";

type StatusObject = { [key: string]: string };

const CorporationLadder = memo((props: ICorporationBlock) => {
  const {
    rotate,
    top,
    bottom,
    right,
    left,
    className,
    CardBgColor,
    CardTextColor,
    bgImage,
    children,
    priceTracker,
    price,
    activeEvents,
    abilityStatus,
    corpName,
    onDoubleClick,
    rotatingCoefficient,
  } = props;

  const [activeEventCoordinates, setActiveEventCoordinates] = useState("");
  const [disableAbilities, setDisableAbilities] = useState(false);

  // Get game data and user info from the store
  const {
    roomCode,
    activeEvents: allEvents,
    gameSettings,
    currentPhase,
    corporations,
  } = useAppSelector((state) => state.game.data);
  const userName = useAppSelector((state) => state.userInfo.userName);
  const { setPlayerAbilitySelected } = useActions();
  const [sendMessage] = useSendMessageMutation();

  const corporationNames = ["BGBO", "MGCR", "CBRT", "Global", "EDSC"] as const;

  // Function to get the transform position of the last card in the deck
  const getCardDeckPosition = useCallback(
    (corp: string) => {
      if (typeof window === "undefined") return;
      const nodes = document.querySelectorAll(`.${corp} .callit_card`);
      const lastCardElement = nodes[nodes.length - 1];
      if (!lastCardElement) return;

      const transformValue = window
        .getComputedStyle(lastCardElement)
        .getPropertyValue("transform");
      if (transformValue !== activeEventCoordinates) {
        setActiveEventCoordinates(transformValue);
      }
    },
    [activeEventCoordinates]
  );

  // Check for Gaze cards when rotatingCoefficient changes
  useEffect(() => {
    if (
      corporationNames.some(
        (corp) => allEvents[corp]?.abilities?.Gaze?.extraData?.card
      )
    ) {
      corporationNames.forEach((corp) => {
        if (allEvents[corp]?.abilities?.Gaze?.extraData?.card) {
          getCardDeckPosition(corp);
        }
      });
    }
  }, [rotatingCoefficient, allEvents, getCardDeckPosition]);

  // Handle ability selection onClick
  const handleAbility = ({
    ability,
    corporation,
  }: {
    ability: string;
    corporation: string;
  }) => {
    const abilityRequest = { name: ability, corporation };
    const payload = { abilityRequest, roomCode };
    const action = constants.ability_action;
    sendMessage({ action, payload });
    setPlayerAbilitySelected(userName);
  };

  // Filter active abilities
  const onAbilities = Object.fromEntries(
    Object.entries(gameSettings.Abilities).filter(
      ([, status]) => status === "On"
    )
  ) as StatusObject;

  // Disable abilities if any are selected
  useEffect(() => {
    setDisableAbilities(
      Object.values(corporations).some(
        (corp) =>
          corp.abilities &&
          Object.values(corp.abilities).some(
            (ability) => ability.status === "Selected"
          )
      )
    );
  }, [corporations]);

  return (
    <>
      <style jsx>{`
        .corner_container {
          transform: rotate(${rotate}deg);
          top: ${top};
          bottom: ${bottom};
          left: ${left};
          right: ${right};
        }
        .active__card {
          background-color: ${CardBgColor};
          color: ${CardTextColor};
          border: 1px solid ${CardTextColor};
          border-radius: 5px;
        }
        .company__card {
          color: ${CardTextColor};
          border-radius: 5px;
        }
      `}</style>

      {/* add a dark dropshadow to board pieces */}
      <svg width="0" height="0">
        <defs>
          <filter id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div
        className={`flex flex-row corner_container ${className}`}
        onDoubleClick={onDoubleClick}
      >
        <RandomWave />
        <div className="flex flex-col items-center">
          <div
            className="company__card"
            style={{
              backgroundImage: `url(${bgImage || ""})`,
              backgroundSize: "cover",
            }}
          >
            <div className="bg" style={{ borderRadius: "0.5rem" }}>
              <Image
                src={bgImage || ""}
                alt="background image"
                width={500}
                height={500}
                style={{ borderRadius: "0.2rem" }}
              />
            </div>
            {corporationNames.some(
              (corp) => allEvents[corp]?.abilities?.Gaze?.extraData?.card
            ) && (
              <div
                className="absolute active__event__card"
                style={{
                  borderRadius: "0.5rem",
                  zIndex: 10,
                  transform: activeEventCoordinates,
                }}
              >
                {corporationNames.map((corp, i) => {
                  if (
                    allEvents[corp]?.abilities?.Gaze?.extraData?.card?.text &&
                    corpName === corp
                  ) {
                    getCardDeckPosition(corp);
                    return (
                      <ActiveEvents
                        key={i}
                        {...allEvents[corp].abilities.Gaze.extraData.card}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}
            {children}
          </div>
          <div className="active__card">
            <div className="bg bg-active">
              <span>Active</span>
              <span>Event</span>
            </div>
            {activeEvents && <ActiveEvents {...activeEvents} />}
          </div>
        </div>
        <div
          className="flex flex-col relative"
          style={{ height: "100%", justifyContent: "end" }}
        >
          <div className="flex flex-col company_abilities">
            <h1 className="company_text">INSIDER ABILITIES</h1>
            <div className="flex flex-row ability__flex">
              <div className="active_ability_bg">
                <AbilityBg text="Active Ability" />
              </div>
              {Object.entries(onAbilities).map(([abilityName], index) => (
                <div key={index} className="ability_img">
                  {abilityStatus[abilityName].status === "Selected" && (
                    <AbilityBg text="" />
                  )}
                  <Image
                    src={`/images/abilities/${abilityName}.webp`}
                    onClick={() => {
                      if (currentPhase !== "Abilities" || disableAbilities)
                        return;
                      setDisableAbilities(true);
                      handleAbility({
                        ability: abilityName,
                        corporation: corpName,
                      });
                    }}
                    className={`${
                      abilityStatus[abilityName].status === "Selected"
                        ? "active_ability"
                        : ""
                    } ability`}
                    alt={`${abilityName} ability`}
                    style={{
                      filter: ["Used", "Unavailable"].includes(
                        abilityStatus[abilityName].status
                      )
                        ? "brightness(25%) url(#dropshadow)"
                        : "url(#dropshadow)",
                      cursor:
                        currentPhase !== "Abilities" || disableAbilities
                          ? "not-allowed"
                          : "pointer",
                      transform:
                        abilityStatus[abilityName].status === "Selected"
                          ? `translate(calc(-${index}00% - ${
                              index * 0.8
                            }vw),137%)`
                          : "translate(0px, 0px)",
                    }}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row trendspace trend_style">
            <div className="arrow">
              <Image
                src={"/images/arrow.webp"}
                alt="trend line"
                width={100}
                height={100}
              />
            </div>
            <Image
              src={priceTracker}
              alt="price tracker"
              width={100}
              height={100}
              className={`priceTracker price${price}`}
            />
            <TrendChart />
          </div>
        </div>
      </div>
    </>
  );
});

CorporationLadder.displayName = "CorporationLadder";
export default CorporationLadder;
