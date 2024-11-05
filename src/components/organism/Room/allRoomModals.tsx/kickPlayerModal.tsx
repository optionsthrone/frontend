"use client";

import React from "react";
import { CloseOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { useActions, useAppSelector } from "@/store/hooks";
import { constants } from "../roomConstants/constants";
import { useSendMessageMutation } from "@/store/api/socketApi";
import Modal from "@/components/atoms/Modal";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";
import ModalBody from "@/components/atoms/Modal/ModalBody";

function KickPlayer() {
  // get roomstate from store
  const roomState = useAppSelector((state) => state.room);

  // get playerToKick from store
  const playerToKick = useAppSelector((state) => state.roomModal.playerToKick);

  // send message to the socket
  const [sendMessage] = useSendMessageMutation();

  // check if open
  const isOpen = useAppSelector((state) => state.roomModal.isOpen);

  const {
    setActionPending,
    kickPlayer,
    banPlayer,
    setPlayerToKick,
    closeRoomModal,
  } = useActions();

  const handleBanPlayer = () => {
    banPlayer(playerToKick);
    sendMessage_KickPlayer(playerToKick, true);
    setPlayerToKick("");
    closeRoomModal();
  };

  const handleKickPlayer = () => {
    kickPlayer(playerToKick);
    sendMessage_KickPlayer(playerToKick, false);
    setPlayerToKick("");
    closeRoomModal();
  };

  const sendMessage_KickPlayer = (
    playerUserName: string,
    isBanned: boolean
  ) => {
    const payload = {
      kickedPlayerUserName: playerUserName,
      isBanned: isBanned,
      roomCode: roomState.roomCode,
    };
    setActionPending(constants.kick_action);
    const action = constants.kick_action;
    sendMessage({ action, payload });
  };

  return (
    <Container>
      <Modal
        open={isOpen}
        onClose={() => {
          closeRoomModal();
        }}
        sx={{
          "& .MuiDialog-paper": {
            background: "transparent",
            height: "20rem",
            boxShadow: "unset",
          },
        }}
      >
        <ModalBody style={{ textAlign: "center" }}>
          {" "}
          <div className="parent__ready__kick">
            <div className="kick-player-window">
              <IconButton
                autoFocus
                className="close-kick-player-btn"
                onClick={() => {
                  closeRoomModal();
                }}
                color="error"
              >
                <CloseOutlined />
              </IconButton>{" "}
              <ModalTitle
                style={{ background: "black", textAlign: "center" }}
                id="Help-Modal-title"
              >
                Kick player
              </ModalTitle>
              <h1>Are you sure you want to kick</h1>
              <h1>{playerToKick}?</h1>
              <div className=" ">
                <Button
                  className=" "
                  color="warning"
                  onClick={handleKickPlayer}
                >
                  Kick
                </Button>
                <Button className=" " color="error" onClick={handleBanPlayer}>
                  Ban
                </Button>
                <Button
                  className=" "
                  color="success"
                  onClick={() => {
                    setPlayerToKick("");
                    closeRoomModal();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>{" "}
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
}

export default KickPlayer;
