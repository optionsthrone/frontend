"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, styled } from "@mui/material";
import GameSettings from "./gameSettings";
import GameControls from "./gameControls";
import GameModal from "./gameModal";
import { useAppSelector, useActions } from "@/store/hooks";
import { useParams } from "next/navigation";
import {
  useSetupSocketQuery,
  useSendMessageMutation,
} from "@/store/api/socketApi";
import { constants } from "./gameConstants/constants";
import Chat from "../Room/chat";
import GameBoard from "../gameboard/board";
import { DNA } from "react-loader-spinner";
import EndGamescreen from "./endGamescreen";
import Timer from "./timer";
import "./game.css";
import AllPlayersData from "./players";
import Ping from "@/components/atoms/ping/ping";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
import FpsCounter from "./fpsCounter";
import { usePrivateMutation } from "@/store/api/roomApi";
import { useRouter } from "next/navigation";

// Styled components for UI layout
const GameWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  color: "hsla(0, 0%, 100%, .8)",
  position: "relative",
  height: "100dvh",
  "@media (max-width:640px)": {
    justifyContent: "space-around",
    flexDirection: "column-reverse",
    height: "100dvh",
    padding: "0.4rem",
  },
});

const LeftSideWrapper = styled(Box)({
  width: "15vw",
  overflowY: "auto",
  zIndex: 100,
  "@media (max-width:640px)": {
    height: "0dvh",
    width: "100vw",
    flexDirection: "row",
    writingMode: "tb-rl",
    transform: "rotate(-180deg)",
  },
});

const RightSideWrapper = styled(Box)({
  width: "25vw",
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  zIndex: 100,
  "@media (max-width:640px)": {
    width: "100vw",
    height: "25dvh",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

const TurnPhase = styled("h2")({
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "1.5rem",
  "@media (max-width:640px)": {
    width: "6vw",
    height: "25dvh",
    writingMode: "tb-rl",
    transform: "rotate(-180deg)",
    overflowX: "auto",
  },
});

const LoadingSpinner = styled(Box)({
  position: "absolute",
  zIndex: "5",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});

const MobileWrapper = styled(Box)({
  margin: "auto",
  "@media (min-width:640px)": {
    display: "none",
  },
});

const PingFpsWrapper = styled(Box)({
  position: "fixed",
  bottom: "0px",
  padding: "0.4rem 0.8rem",
  left: "0px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  fontSize: "1.2dvh",
  "@media (max-width:640px)": {
    writingMode: "tb-rl",
    transform: "rotate(180deg)",
    right: "0px",
    width: "max-content",
  },
});

const DesktopWrapper = styled(Box)({
  alignSelf: "flex-end",
  "@media (max-width:640px)": {
    display: "none",
  },
});

const SpinnerShadow = styled(Box)({
  position: "absolute",
  bottom: "10dvh",
  left: "50%",
  width: "100%",
  transform: "translateX(-50%)",
  height: "1.5dvh",
  backgroundImage:
    "radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%)",
});

// Main Game Component
const Game = () => {
  const router = useRouter();

  // Chatbox state management
  const [showUnreadMessagesIndicator, setShowUnreadMessagesIndicator] =
    useState(false);
  const [chatNumber, setChatNumber] = useState(0);
  const [canJoin, setCanJoin] = useState(false);

  // Get screen width context
  const { width } = useWindowSizeContext();

  // Get necessary states from store
  const roomState = useAppSelector((state) => state.room);
  const { token } = useAppSelector((state) => state.userInfo);
  const { roomCode } = useParams();
  const gameState = useAppSelector((state) => state.game.data);
  const chatLog = useAppSelector((state) => state.chatMessages);
  const { type, message } = useAppSelector((state) => state.gameStatus);
  const isOpenEndGameModal = useAppSelector(
    (state) => state.endGameModal.isOpen
  );
  const isOpen = useAppSelector((state) => state.chatModal.isOpen);
  const { currentPhase, currentTurn, gameSettings } = gameState;

  // Setup socket query and sendMessage mutation
  const [sendMessage] = useSendMessageMutation();
  const [privateRoomAction] = usePrivateMutation();
  const {
    toggleSuccessSnackbar,
    toggleErrorSnackbar,
    setAdjust,
    openGameModal,
    openEndGameModal,
    setGameStatus,
  } = useActions();

  const payload = { roomCode: String(roomCode) };
  const action = constants.get_game_state_action;

  // get game state action
  // this is to prevent calling the action twice
  let requestGameState = false;
  useEffect(() => {
    if (requestGameState) return;
    requestGameState = true;
    sendMessage({ action, payload });
  }, []);
  // Function to join room
  const joinRoom = () => {
    privateRoomAction({ roomCode, token })
      .unwrap()
      .then(() => {
        setCanJoin(true);
        toggleSuccessSnackbar({ message: "Joined successfully" });
      })
      .catch((e) =>
        toggleErrorSnackbar({ message: e.data?.message || "Failed" })
      );
  };

  // Setup socket connection and send initial game state request
  useSetupSocketQuery(
    { roomCode, token },
    {
      pollingInterval: 30000,
      skipPollingIfUnfocused: true,
      refetchOnReconnect: true,
      skip: !canJoin,
    }
  );

  useEffect(() => {
    if (roomState.roomCode) return;
    joinRoom();
  }, []);

  // Fetch chat messages when game state changes
  useEffect(() => {
    if (!gameState.roomCode) return;
    const chatPayload = {
      roomCode: gameState.roomCode,
      message: "",
      get_chat: true,
    };
    sendMessage({ action: constants.chat_action, payload: chatPayload });
  }, [gameState]);

  // Update unread messages indicator
  useEffect(() => {
    if (chatLog.length > chatNumber) {
      setShowUnreadMessagesIndicator(true);
      setChatNumber(chatLog.length);
    } else {
      setShowUnreadMessagesIndicator(false);
    }
  }, [chatLog, isOpen]);

  // Display notifications based on game status
  useEffect(() => {
    if (type === "success") {
      toggleSuccessSnackbar({ message });
    } else {
      toggleErrorSnackbar({ message });
    }
    if (message === "WebSocket connection error") {
      setGameStatus({ type: "", message: "" });
      router.push("/");
    }
  }, [type, message]);

  // Open end game modal if current phase is "End Game"
  useEffect(() => {
    if (isOpenEndGameModal || currentPhase !== "End Game") return;
    openEndGameModal();
  }, [currentPhase]);

  return (
    <div>
      {gameState ? (
        <GameWrapper>
          <PingFpsWrapper>
            <Ping />

            <FpsCounter />
          </PingFpsWrapper>
          {isOpenEndGameModal && <EndGamescreen />}
          <LeftSideWrapper>{width > 640 && <AllPlayersData />}</LeftSideWrapper>
          <div className="board-container">
            <div className="board ">
              <GameBoard />
            </div>
          </div>
          <RightSideWrapper>
            <TurnPhase>
              Turn {currentTurn} : {currentPhase} Phase
            </TurnPhase>
            <MobileWrapper>{width < 640 && <Timer />}</MobileWrapper>

            {/* <Button
              variant="outlined"
              // onClick={() => {
              //   isControlsOpen && controlsModalType === "controls"
              //     ? closeGameControlsModal()
              //     : openGameControlsModal("controls");
              // }}
              sx={{
                display: "none",
                "@media (max-width:640px)": {
                  display: " block",
                  width: "max-content",
                  height: "25dvh",
                  writingMode: "tb-rl",
                  transform: "rotate(-180deg)",
                  overflowX: "auto",
                  padding: "0",
                  minWidth: "30px",
                  backgroundColor: "#000000a8",
                  color: "white",
                  margin: " 0 0.4rem",
                  fontSize: " 0.7rem",
                },
              }}
            >
              Game Controls
            </Button> */}
            <Button
              variant="outlined"
              onClick={() => {
                setAdjust({
                  position: {
                    buyingPower: 0,
                    corporation: "",
                    coveringLeg: null,
                    primaryLeg: {
                      direction: "",
                      expiry: currentTurn + 1,
                      margin: false,
                      quantity: 1,
                      strike: 50,
                      type: "",
                      price: 0,
                    },
                  },
                  tradeType: "New Trade",
                });
                openGameModal("trade");
              }}
              sx={{
                display: "none",
                "@media (max-width:640px)": {
                  display: " block",
                  width: "max-content",
                  height: "25dvh",
                  writingMode: "tb-rl",
                  transform: "rotate(-180deg)",
                  overflowX: "auto",
                  padding: "0",
                  minWidth: "30px",
                  backgroundColor: "#000000a8",
                  color: "white",
                  margin: " 0 0.4rem",
                  fontSize: " 0.7rem",
                },
              }}
            >
              Trade
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                openGameModal("ability");
              }}
              sx={{
                display: "none",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
                "@media (max-width:640px)": {
                  display: " block",
                  width: "max-content",
                  height: "25dvh",
                  writingMode: "tb-rl",
                  transform: "rotate(-180deg)",
                  overflowX: "auto",
                  padding: "0",
                  minWidth: "30px",
                  backgroundColor: "#000000a8",
                  color: "white",
                  margin: " 0 0.4rem",
                  fontSize: " 0.7rem",
                },
              }}
              disabled={currentPhase !== "Abilities" ? true : false}
            >
              Abilities
            </Button>

            <Button
              variant="outlined"
              // onClick={() => {
              //   isControlsOpen && controlsModalType === "settings"
              //     ? closeGameControlsModal()
              //     : openGameControlsModal("settings");
              // }}
              onClick={() => {
                openGameModal("open trades");
              }}
              sx={{
                display: "none",
                "@media (max-width:640px)": {
                  display: " block",
                  width: "max-content",
                  height: "25dvh",
                  writingMode: "tb-rl",
                  transform: "rotate(-180deg)",
                  overflowX: "auto",
                  padding: "0",
                  minWidth: "30px",
                  backgroundColor: "#000000a8",
                  color: "white",
                  margin: " 0 0.4rem",
                  fontSize: " 0.7rem",
                },
              }}
            >
              Positions
            </Button>
            <Button
              variant="outlined"
              // onClick={() => {
              //   isControlsOpen && controlsModalType === "settings"
              //     ? closeGameControlsModal()
              //     : openGameControlsModal("settings");
              // }}
              onClick={() => {
                openGameModal("game settings");
              }}
              sx={{
                display: "none",
                "@media (max-width:640px)": {
                  display: " block",
                  width: "max-content",
                  height: "25dvh",
                  writingMode: "tb-rl",
                  transform: "rotate(-180deg)",
                  overflowX: "auto",
                  padding: "0",
                  minWidth: "30px",
                  backgroundColor: "#000000a8",
                  color: "white",
                  margin: " 0 0.4rem",
                  fontSize: " 0.7rem",
                },
              }}
            >
              game Settings
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to leave the game?")
                ) {
                  window.location.href = "/";
                }
              }}
              sx={{
                display: "none",
                "@media (max-width:640px)": {
                  display: " block",
                  width: "max-content",
                  height: "25dvh",
                  writingMode: "tb-rl",
                  transform: "rotate(-180deg)",
                  overflowX: "auto",
                  padding: "0",
                  minWidth: "30px",
                  backgroundColor: "#000000a8",
                  color: "white",
                  margin: " 0 0.4rem",
                  fontSize: " 0.7rem",
                },
              }}
            >
              Leave Game
            </Button>
            <DesktopWrapper className="flex">
              <Timer />

              {currentPhase && (
                <GameControls
                  // roomCode={String(roomCode)}
                  currentPhase={currentPhase}
                  // gameSettings={gameSettings}
                />
              )}
            </DesktopWrapper>
            <GameSettings settings={gameSettings} />
            <Chat
              showUnreadMessagesIndicator={showUnreadMessagesIndicator}
              chatLog={chatLog}
            />
          </RightSideWrapper>
          <GameModal />
        </GameWrapper>
      ) : (
        <LoadingSpinner>
          <DNA width="80vw" height="80dvh" />
          <SpinnerShadow />
        </LoadingSpinner>
      )}
    </div>
  );
};

export default Game;
