"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useActions, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useSetupSocketQuery } from "@/store/api/socketApi";
import ActionButtons from "./actionButtons";
import Players from "./players/players";
import Chat from "./chat";
import RoomModal from "./allRoomModals.tsx/roomModal";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import bullishGif from "@/playground_assets/bullish.gif";
import ChangeRoom from "./changeRoom";
import CopyRoomcode from "./copyRoomcode";
import GameSettings from "./roomGameSettings/roomGameSettings";
import { usePrivateMutation } from "@/store/api/roomApi";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { constants } from "./roomConstants/constants";

// Styled components for layout consistency and responsiveness
const RoomWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "4rem",
  color: "hsla(0, 0%, 100%, .8)",
  flex: "1 1 0",
  height: "100dvh",
  padding: 0,
});

const RoomPropsWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  height: "70dvh",
  color: "hsla(0, 0%, 100%, .8)",
  flex: "1 1 0",
});

const RoomInfoWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  color: "hsla(0, 0%, 100%, .8)",
});

// Props types
interface IProps {
  roomCodeParam: string;
}

// Initial empty chats array for state comparison
let chats = [
  {
    userName: "",
    message: "",
    timestamp: "",
  },
];

const Room = ({ roomCodeParam }: IProps) => {
  const router = useRouter();

  // Setup RTK mutations and actions
  const [privateRoomAction, { isLoading }] = usePrivateMutation();
  const [sendMessage] = useSendMessageMutation();
  const { toggleSuccessSnackbar, toggleErrorSnackbar, setGameStatus } =
    useActions();

  // Redux state selectors
  const roomState = useAppSelector((state) => state.room);
  const isOpen = useAppSelector((state) => state.chatModal.isOpen);
  const { currentPhase } = useAppSelector((state) => state.game.data);
  const chatLog = useAppSelector((state) => state.chatMessages);
  const { token } = useAppSelector((state) => state.userInfo);
  const { type, message } = useAppSelector((state) => state.gameStatus);

  // Component state
  const [showUnreadMessagesIndicator, setShowUnreadMessagesIndicator] =
    useState(false);
  const [canJoin, setCanJoin] = useState(false);

  const roomCode = roomCodeParam;

  // Handle room joining with mutation
  const joinRoom = () =>
    privateRoomAction({ roomCode, token })
      .unwrap()
      .then(() => {
        toggleSuccessSnackbar({
          message: "Joined successfully",
        });
      })
      .catch((e) => {
        if (e.data) {
          toggleErrorSnackbar({
            message: e.data?.message || " Failed",
          });
        }
      })
      .finally(() => {
        setCanJoin(true);
      });

  // WebSocket setup query, triggered only after the room join succeeds
  const { data } = useSetupSocketQuery({ roomCode, token }, { skip: !canJoin });

  // UseEffect: Join the room on initial render
  useEffect(() => {
    joinRoom();
  }, []);

  //  UseEffect: send chat flag
  useEffect(() => {
    if (!roomState.roomCode) return;
    const payload = {
      roomCode: roomState.roomCode,
      message: "",
      get_chat: true,
    };

    sendMessage({ action: constants.chat_action, payload });
  }, [roomState.roomCode]);

  // UseEffect: Handle WebSocket connection status and errors
  useEffect(() => {
    if (type === "success") {
      toggleSuccessSnackbar({ message });
    } else if (type === "error") {
      toggleErrorSnackbar({ message });
    }

    if (message === "WebSocket connection error") {
      setGameStatus({ type: "", message: "" });
      router.push("/");
    }
  }, [type, message]);

  // UseEffect: Manage unread chat message indicator
  useEffect(() => {
    if (data && data.data) {
      if (data.data.wasKicked) {
        router.push("/");
      } else if (chatLog.length > chats.length) {
        setShowUnreadMessagesIndicator(true);
        chats = chatLog;
      } else {
        setShowUnreadMessagesIndicator(false);
      }
    }
  }, [roomState, isOpen, chatLog]);

  // UseEffect: Redirect to game screen if the game is in progress
  useEffect(() => {
    if (roomState.gameInProgress && currentPhase !== "End Game") {
      router.push(`/room/${roomCode}/game`);
    }
  }, [roomState.gameInProgress]);

  return (
    <div className="room-container">
      {/* Conditional rendering based on loading and room state */}
      {!isLoading && roomState.roomCode ? (
        <RoomWrapper>
          <RoomModal />
          <RoomPropsWrapper>
            <GameSettings />
            <ActionButtons />
            <Players />
          </RoomPropsWrapper>
          <RoomInfoWrapper>
            <ChangeRoom />
            <CopyRoomcode />
            <Chat
              showUnreadMessagesIndicator={showUnreadMessagesIndicator}
              chatLog={chatLog}
            />
          </RoomInfoWrapper>
        </RoomWrapper>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100dvh",
          }}
        >
          <Image src={bullishGif} alt="Bullish!" />
        </div>
      )}
    </div>
  );
};

export default Room;
