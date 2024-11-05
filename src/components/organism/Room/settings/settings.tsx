"use client";

import React from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import { useActions, useAppSelector } from "@/store/hooks";
import { TailSpin } from "react-loader-spinner";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { constants } from "../roomConstants/constants";
import { IAbilities, IGameSettings } from "@/types/interfaces/room/room";
import { Dialog, styled } from "@mui/material";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    padding: "0 25px",
    borderRadius: "8px",
    minWidth: "70vw",
    backgroundColor: "transparent",
    color: "#fff",
    // height: "-webkit-fill-available",
  },
}));

function Settings() {
  // get isloading after saving settings
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  // open modal
  const { openRoomModal, resetGameSettings, updateSettings, setActionPending } =
    useActions();

  // get roomstate from store
  const roomState = useAppSelector((state) => state.room);

  // get close modal reducer from store
  const { closeRoomModal } = useActions();

  // check if open
  const isOpen = useAppSelector((state) => state.roomModal.isOpen);

  // get game info from the store
  const { gameSettings } = useAppSelector((state) => state.game.data);

  // get form values onchange
  const [settingsParams, setSettingsParams] = React.useState<IGameSettings>(
    roomState.gameSettings
  );

  // display error in snackbar
  const { toggleErrorSnackbar } = useActions();

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    // console.log(typeof evt);

    const value = e.target.value;
    setSettingsParams({
      ...settingsParams,
      [e.target.name]:
        e.target.name === "Starting Cash" ? Number(value) : value,
    });
  }
  // count number of on abilities
  function countOnAbilities(abilitiesObject: IAbilities) {
    let count = 0;
    for (const ability in abilitiesObject) {
      if (abilitiesObject[ability] === "On") {
        count++;
      }
    }
    return count;
  }

  function toggleAbility(ability: string) {
    const numberOfOnAbilities = countOnAbilities(settingsParams.Abilities);

    if (
      numberOfOnAbilities >= 6 &&
      settingsParams.Abilities[ability] === "Off"
    ) {
      toggleErrorSnackbar({
        message: "Maximum number of ON abilities reached",
      });
      return;
    }

    setSettingsParams({
      ...settingsParams,
      Abilities: {
        ...settingsParams.Abilities,
        [ability]: settingsParams.Abilities[ability] === "On" ? "Off" : "On",
      },
    });
  }
  // save settings
  const saveSettings = () => {
    const payload = { settings: settingsParams, roomCode: roomState.roomCode };
    setActionPending(constants.update_settings_action);

    const action = constants.update_settings_action;
    sendMessage({ action, payload });
    updateSettings(settingsParams);
    closeRoomModal();
  };
  // console.log(isLoading, isSuccess);

  return (
    <StyledDialog
      open={isOpen}
      onClose={() => {
        closeRoomModal();
      }}
      fullScreen={true}
      sx={{
        // background: "black",
        width: "100%",
      }}
    >
      <ModalBody>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings();
          }}
        >
          <div className="settings-window" style={{ background: "black" }}>
            <div className="settings-window-header">
              <Button
                className="settings-header-btn"
                onClick={() => {
                  openRoomModal("settingsHelp");
                }}
              >
                ?
              </Button>
              <h1 className="settings-window-header-text">Settings</h1>
              <Button
                className="settings-header-btn"
                onClick={() => {
                  closeRoomModal();
                }}
              >
                X
              </Button>
            </div>

            <div className="settings-window-body">
              <div className="settings-window-body-row">
                <div className="settings-window-body-row-label">
                  <h1>Game Mode</h1>
                </div>
                <div className="settings-window-body-row-input">
                  <select
                    className="settings-window-body-row-input-select"
                    name="Game Mode"
                    value={settingsParams["Game Mode"]}
                    onChange={handleChange}
                    required
                  >
                    <option value="Classic">Classic</option>
                    {/* <option value="Speed">Speed</option> */}
                  </select>
                </div>
              </div>
              <div className="settings-window-body-row">
                <div className="settings-window-body-row-label">
                  <h1>Game Type</h1>
                </div>
                <div className="settings-window-body-row-input">
                  <select
                    className="settings-window-body-row-input-select"
                    name="Game Type"
                    value={settingsParams["Game Type"]}
                    onChange={handleChange}
                    required
                  >
                    <option value="Casual">Casual</option>
                    <option value="Ranked">Ranked</option>
                  </select>
                </div>
              </div>
              <div className="settings-window-body-row">
                <div className="settings-window-body-row-label">
                  <h1>Starting Cash</h1>
                </div>
                <div className="settings-window-body-row-input">
                  <input
                    type="number"
                    min={1000}
                    max={10000000}
                    step={1000}
                    className="settings-window-body-row-input-number"
                    id="starting-cash-input"
                    name="Starting Cash"
                    value={settingsParams["Starting Cash"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="settings-window-body-row">
                <div className="settings-window-body-row-label">
                  <h1>Max Players</h1>
                </div>
                <div className="settings-window-body-row-input">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    step={1}
                    className="settings-window-body-row-input-number"
                    id="max-players-input"
                    name="Max Players"
                    value={settingsParams["Max Players"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="settings-window-body-row">
                <div className="settings-window-body-row-label">
                  <h1>{"Trading Phase Time Limit (seconds)"}</h1>
                </div>
                <div className="settings-window-body-row-input">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    step={1}
                    className="settings-window-body-row-input-number"
                    id="trading-phase-time-limit-input"
                    name="Trading Phase Time Limit"
                    value={settingsParams["Trading Phase Time Limit"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="settings-window-body-row">
                <div className="settings-window-body-row-label">
                  <h1>{"Abilities Phase Time Limit (seconds)"}</h1>
                </div>
                <div className="settings-window-body-row-input">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    step={1}
                    className="settings-window-body-row-input-number"
                    id="ability-phase--time-limit-input"
                    name="Abilities Phase Time Limit"
                    value={settingsParams["Abilities Phase Time Limit"]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="settings-window-body-abilities">
                <div className="settings-window-body-row-label">
                  <h1>Abilities</h1>
                </div>
                <div className="settings-window-body-row-abilities">
                  {Object.keys(gameSettings.Abilities).map((ability, i) => (
                    <Button
                      className={`settings-window-body-row-abilities-button ${
                        settingsParams["Abilities"][ability] === "On"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleAbility(ability)}
                      key={i}
                    >
                      <Image
                        src={`/images/abilities/${ability}.webp`}
                        alt={ability}
                        className="settings-window-ability-img"
                        width={300}
                        height={300}
                      />
                    </Button>
                  ))}

                  {/* <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Gaze"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Gaze")}
                  >
                    <Image
                      src={gazeImg}
                      alt="Gaze"
                      className="settings-window-ability-img"
                    />
                  </Button>
                  <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Halt"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Halt")}
                  >
                    <Image
                      src={haltImg}
                      alt="Halt"
                      className="settings-window-ability-img"
                    />
                  </Button>
                  <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Reject"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Reject")}
                  >
                    <Image
                      src={rejectImg}
                      alt="Reject"
                      className="settings-window-ability-img"
                    />
                  </Button> */}
                  {/* </div>
                <div className="settings-window-body-row-abilities"> */}
                  {/* <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Protect"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Protect")}
                  >
                    <Image
                      src={protectImg}
                      alt="Protect"
                      className="settings-window-ability-img"
                    />
                  </Button>
                  <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Dividend"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Dividend")}
                  >
                    <Image
                      src={dividendImg}
                      alt="Dividend"
                      className="settings-window-ability-img"
                    />
                  </Button>
                  <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Price Action Up"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Price Action Up")}
                  >
                    <Image
                      src={priceActionUpImg}
                      alt="Price Action Up"
                      className="settings-window-ability-img"
                    />
                  </Button>
                  <Button
                    className={`settings-window-body-row-abilities-button ${
                      settingsParams["Abilities"]["Price Action Down"] === "On"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleAbility("Price Action Down")}
                  >
                    <Image
                      src={priceActionDownImg}
                      alt="Price Action Down"
                      className="settings-window-ability-img"
                    />
                  </Button> */}
                </div>
              </div>
            </div>
            <div className="settings-window-footer">
              <Button
                className="settings-window-footer-btn"
                onClick={() => {
                  resetGameSettings();
                }}
                style={{
                  color: "white",
                }}
              >
                Default
              </Button>
              <Button
                type="submit"
                className="settings-window-footer-btn"
                disabled={isLoading}
                style={{
                  color: "white",
                  opacity: isLoading ? 0.5 : 1,
                  pointerEvents: isLoading ? "none" : "auto",
                }}
              >
                {isLoading ? (
                  <TailSpin color="#00BFFF" height="min(5dvh, 5vw)" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                className="settings-window-footer-btn"
                onClick={() => {
                  closeRoomModal();
                }}
                style={{
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>{" "}
        </form>
      </ModalBody>
    </StyledDialog>
  );
}

export default Settings;
