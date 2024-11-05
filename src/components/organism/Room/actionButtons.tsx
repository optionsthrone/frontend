import React, { useState } from "react";
import Button from "@mui/material/Button";
import { TailSpin } from "react-loader-spinner";
import { useActions, useAppSelector } from "@/store/hooks";
import { constants } from "./roomConstants/constants";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const ActionButtonWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  gap: "2rem",
  "@media (max-width:640px)": {},
});
const ButtonWrapper = styled(Button)({
  color: "white",
  fontSize: "2dvh",
  borderColor: "transparent",
  width: "80%",
  background: " rgba(0, 0, 0, 0.5)",
  borderRadius: "20dvh",
  ":hover": {
    background: " rgba(0, 0, 0, 0.7)",
  },
  "@media (max-width:640px)": {
    fontSize: "1dvh",
  },
  "&.Mui-disabled": {
    color: "rgba(255, 255, 255, 0.5)",
  },
});

const ActionButtons = () => {
  const { openRoomModal, setPlayerReady, setActionPending } = useActions();

  // set loading state
  const [loading, setLoading] = useState(false);

  // get roomstate from store
  const roomState = useAppSelector((state) => state.room);

  // get username from store
  const { userName, uuid } = useAppSelector((state) => state.userInfo);

  // unique user uuid
  const userId = uuid.userID;

  // send message to the socket
  const [sendMessage] = useSendMessageMutation();

  // initiate next-router
  const router = useRouter();

  // start game
  const sendMessage_Start = () => {
    setActionPending(constants.start_action);
    const action = constants.start_action;
    const payload = {
      roomCode: roomState.roomCode,
    };
    sendMessage({ action, payload });
  };

  // send message that you're ready
  const sendMessage_Ready = () => {
    setActionPending(constants.ready_action);
    const action = constants.ready_action;
    const payload = {
      roomCode: roomState.roomCode,
    };
    sendMessage({ action, payload });
  };

  // start or ready game
  const handleStartReadyButtonClick = () => {
    const allPlayersReady = Object.values(roomState.playerData).every(
      (player) => player.readyState === "ready" || player.readyState === "host"
    );
    if (userName === roomState.hostUserName) {
      if (!allPlayersReady) {
        setLoading(false);
        openRoomModal("not all ready");
      } else {
        sendMessage_Start();
      }
    } else {
      setPlayerReady(userId);
      sendMessage_Ready();
    }
  };

  // leave room
  const leaveRoom = () => {
    alert("You will be redirected to the homepage.");
    // Trigger hashchange event
    window.location.hash = "homepage";
    // Trigger popstate event
    window.history.pushState({}, "", "/");
    router.push("/"); // Redirect to the homepage
  };

  return (
    <ActionButtonWrapper>
      <ButtonWrapper
        className="help-btn"
        onClick={() => {
          openRoomModal("help");
        }}
      >
        Help
      </ButtonWrapper>{" "}
      <ButtonWrapper
        className={`  ${
          roomState.playerData[userId].readyState === "ready" &&
          !roomState.gameInProgress
            ? "start-ready-disabled"
            : "start-ready-enabled"
        } start-ready-btn`}
        disabled={roomState.playerData[userId].readyState === "ready"}
        onClick={() => {
          if (loading) return;
          setLoading(true);
          handleStartReadyButtonClick();
        }}
      >
        {userName === roomState.hostUserName ? (
          loading ? (
            <TailSpin color="#00BFFF" height="min(5dvh, 5vw)" />
          ) : (
            "Start Game"
          )
        ) : (
          "Ready"
        )}
      </ButtonWrapper>
      {userName === roomState.hostUserName ? (
        <ButtonWrapper
          className="edit-settings-btn"
          onClick={() => {
            openRoomModal("settings");
          }}
        >
          Settings
        </ButtonWrapper>
      ) : null}
      <ButtonWrapper className="leave-room-btn" onClick={leaveRoom}>
        Leave Room
      </ButtonWrapper>
    </ActionButtonWrapper>
  );
};

export default ActionButtons;
