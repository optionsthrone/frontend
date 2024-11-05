"use client";

import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { useActions, useAppSelector } from "@/store/hooks";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { constants } from "../gameConstants/constants";
import Modal from "@/components/atoms/Modal";
import ModalActions from "@/components/atoms/Modal/ModalActions";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";
import "./ability.css";

import gazeImg from "@/playground_assets/board tokens/Gaze.png";
import haltImg from "@/playground_assets/board tokens/Halt.png";
import rejectImg from "@/playground_assets/board tokens/Reject.png";
import protectImg from "@/playground_assets/board tokens/Protect.png";
import dividendImg from "@/playground_assets/board tokens/Dividend.png";
import priceActionImg from "@/playground_assets/board tokens/PriceAction.png";
import {
  IAbilitesDesc,
  IAbilitesImage,
  IGame,
} from "@/types/interfaces/game/game";
import Image from "next/image";

function Ability() {
  // get isloading after saving settings
  const [sendMessage] = useSendMessageMutation();

  // open modal
  const { closeGameModal, setActionPending } = useActions();

  // check if open
  const isOpen = useAppSelector((state) => state.gameModal.isOpen);

  // get gameState from store
  const gameState: IGame = useAppSelector((state) => state.game.data);

  // type ArrayType = [
  //   "Reject",
  //   "PriceAction",
  //   "Protect",
  //   "Halt",
  //   "Gaze",
  //   "Dividend"
  // ];
  const [name, setName] = useState<string>();
  const [corporation, setCorporation] = useState<string>();
  const [direction, setDirection] = useState<string>("");
  const [abilities, setAbilities] = useState<string[]>([]);
  const [corpAvailabilityStatusText, setCorpAvailabilityStatusText] = useState<
    null | string
  >(null);

  const abilityImages: IAbilitesImage = {
    Gaze: gazeImg.src,
    Halt: haltImg.src,
    Reject: rejectImg.src,
    Protect: protectImg.src,
    Dividend: dividendImg.src,
    "Price Action": priceActionImg.src,
  };

  const abilityDescriptions: IAbilitesDesc = {
    Gaze: "Reveal the top card of the deck for this corporation",
    Halt: "Halt all trading for this corporation",
    Reject: "Reject and discard the card drawn for this corporation",
    Protect:
      "Any price change from the global does not apply to this corporation",
    Dividend:
      "Pay $20/share dividend to each player who owns shares in this corporation",
    "Price Action": "Move the price of this corporation up or down by $10",
  };

  const handleAbility = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const abilityRequest = {
      name,
      corporation,
      direction,
    };

    const payload = {
      abilityRequest: abilityRequest,
      roomCode: gameState.roomCode,
    };
    const action = constants.ability_action;
    setActionPending(action);
    sendMessage({ action, payload });
  };

  // update the abilities when corporation changes
  useEffect(() => {
    if (corporation) {
      if (
        Object.keys(gameState.corporations[corporation]["abilities"]).some(
          (ability) =>
            gameState.corporations[corporation]["abilities"][ability][
              "status"
            ] === "Selected"
        )
      ) {
        setCorpAvailabilityStatusText(
          "An ability has already been selected for this corporation this turn"
        );
      } else if (
        Object.keys(gameState["corporations"][corporation]["abilities"]).some(
          (ability) =>
            gameState["corporations"][corporation]["abilities"][ability][
              "status"
            ] === "Available"
        )
      ) {
        setCorpAvailabilityStatusText("Abilities Available:");
      } else {
        setCorpAvailabilityStatusText("No abilities left");
      }

      const corpAbilities = gameState["corporations"][corporation]["abilities"];
      setAbilities(
        Object.keys(corpAbilities).filter(
          (ability) => corpAbilities[ability]["status"] === "Available"
        )
      );
    } else {
      setAbilities([]);
      setCorpAvailabilityStatusText(null);
    }
    setName("");
    setDirection("");
  }, [corporation, gameState]);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        closeGameModal();
      }}
      fullScreen={true}
      sx={{
        background: "black",
        width: "100%",
      }}
    >
      <ModalTitle style={{ cursor: "move" }} id="Help-dialog-title">
        Abilities
      </ModalTitle>{" "}
      <ModalBody>
        <form className="ability-form" onSubmit={handleAbility}>
          <div className="title-section">
            <h1 className="trade-title">Ability</h1>
            <button
              className="close-trade-screen-btn"
              onClick={() => {
                closeGameModal();
              }}
            >
              X
            </button>
          </div>
          <div className="select-corporation">
            <h3>Corporation:</h3>
            <select
              value={corporation}
              className="corporation-dropdown"
              onChange={(e) => {
                setCorporation(e.target.value);
              }}
            >
              <option value="">Select corporation</option>
              <option value="CBRT">CBRT</option>
              <option value="EDSC">EDSC</option>
              <option value="BGBO">BGBO</option>
              <option value="MGCR">MGCR</option>
            </select>
          </div>
          <div
            className="select-ability"
            style={
              corpAvailabilityStatusText
                ? { padding: "5vh" }
                : { padding: "1vh" }
            }
          >
            <h3>{corpAvailabilityStatusText}</h3>
            {corpAvailabilityStatusText === "Abilities Available:" && (
              <div className="select-ability-row">
                {abilities.map((ability, index) => (
                  <div
                    className="select-ability-radio"
                    title={abilityDescriptions[ability]}
                    key={index}
                    onClick={() => {
                      setName(ability);
                      setDirection("");
                    }}
                  >
                    <label
                      className={`ability-label ${
                        name === ability ? "selected" : "unselected"
                      }`}
                      htmlFor={ability}
                    >
                      {ability}
                    </label>
                    <Image
                      width={90}
                      height={100}
                      key={corporation + ability}
                      src={abilityImages[ability]}
                      alt="Ability"
                      className={`ability-screen-ability-token ${
                        name === ability ? "selected" : "unselected"
                      }`}
                    />
                    <input
                      type="radio"
                      id={ability}
                      value={ability}
                      name="ability"
                      className="ability-radio"
                      checked={name === ability}
                      onChange={(e) => {
                        setName(e.target.value);
                        setDirection("");
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {name === "Price Action" && (
            <div className="select-direction">
              <h3>Direction:</h3>
              <div className="select-direction-row">
                <div className="select-direction-radio">
                  <label
                    className={`direction-label ${
                      direction === "up" ? "selected" : "unselected"
                    }`}
                    htmlFor="up"
                  >
                    +$10
                  </label>
                  <input
                    type="radio"
                    id="up"
                    value="up"
                    name="direction"
                    className="ability-radio"
                    checked={direction === "up"}
                    onChange={(e) => setDirection(e.target.value)}
                  />
                </div>
                <div className="select-direction-radio">
                  <label
                    className={`direction-label ${
                      direction === "down" ? "selected" : "unselected"
                    }`}
                    htmlFor="down"
                  >
                    -$10
                  </label>
                  <input
                    type="radio"
                    id="down"
                    value="down"
                    name="direction"
                    className="ability-radio"
                    checked={direction === "down"}
                    onChange={(e) => setDirection(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <input
            type="submit"
            className={`use-ability-btn ${
              !name || !corporation || (name === "Price Action" && !direction) // disable button if no ability is selected
                ? "disabled"
                : ""
            }`}
            disabled={
              !name || !corporation || (name === "Price Action" && !direction)
            }
            value="Use Ability"
          />
        </form>
      </ModalBody>
      <ModalActions>
        <IconButton
          autoFocus
          onClick={() => {
            closeGameModal();
          }}
          color="primary"
          sx={{
            position: "absolute",
            left: "2px%",
            top: "2px",

            color: "gray",
          }}
        >
          <CloseOutlined />
        </IconButton>
      </ModalActions>
    </Modal>
  );
}

export default Ability;
