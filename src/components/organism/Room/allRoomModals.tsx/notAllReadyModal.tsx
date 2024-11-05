"use client";

import React from "react";
import { useActions, useAppSelector } from "@/store/hooks";
import { constants } from "../roomConstants/constants";
import { useSendMessageMutation } from "@/store/api/socketApi";
import Modal from "@/components/atoms/Modal";
import ModalBody from "@/components/atoms/Modal/ModalBody";

function NotAllReadyModal() {
  // send message to the socket
  const [sendMessage] = useSendMessageMutation();

  // get close modal reducer from store
  const { closeRoomModal, setActionPending } = useActions();

  // get roomstate from store
  const roomState = useAppSelector((state) => state.room);

  // check if open
  const isOpen = useAppSelector((state) => state.roomModal.isOpen);

  // start game
  const sendMessage_Start = () => {
    setActionPending(constants.start_action);
    const action = constants.start_action;
    const payload = {
      roomCode: roomState.roomCode,
    };
    sendMessage({ action, payload });
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          closeRoomModal();
        }}
        sx={{
          "& .MuiDialog-paper": {
            background: "transparent",
            height: "30rem",
            boxShadow: "unset",
          },
        }}
      >
        <ModalBody>
          {" "}
          <div className="parent__ready__kick">
            <div className="not-all-players-ready-window">
              <div className="not-all-players-ready-window-header">
                <button
                  className="close-not-all-players-ready-btn"
                  onClick={() => {
                    closeRoomModal();
                  }}
                >
                  X
                </button>
              </div>
              <div className="not-all-players-ready-window-body">
                <div className="not-all-players-ready-window-body-text">
                  <h1>Not all players are ready!</h1>
                </div>
                <div className="not-all-players-ready-window-body-buttons">
                  <button
                    className="not-all-players-ready-window-body-btn"
                    onClick={() => {
                      sendMessage_Start();
                    }}
                  >
                    Start Anyway
                  </button>
                  <button
                    className="not-all-players-ready-window-body-btn"
                    onClick={() => {
                      closeRoomModal();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>{" "}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default NotAllReadyModal;
