"use client";
import React, { useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";
import { Box, styled } from "@mui/material";
import { useActions, useAppSelector } from "@/store/hooks";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";
const GameWrapper = styled(Box)({
  borderRadius: "1dvh",
  boxShadow: "0 0 20px rgba(0,0,0,.3)",
  display: "flex",
  flexDirection: "column",
  margin: "10px",
  padding: "20px",
  width: "100%",
  "@media (max-width:640px)": {
    height: "auto",
  },
  overflow: "hidden",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    width: "9px",
    backgroundColor: "rgba(0, 0, 0, .2)",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
    backgroundColor: "#555",
  },
});

const GameTitle = styled("h2")({
  fontSize: "16px",
  padding: "10px 20px",
});

const GameListWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const GameListRow = styled(Box)({
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, .2)",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "row",
  height: "50px",
  justifyContent: "space-between",
  margin: "5px",
  padding: "0px 20px",
  fontSize: "0.65rem",
  "@media (max-width:640px)": {
    height: "100%",
    padding: "0.4rem",
    fontSize: "0.5rem",
  },
});

const GameSettingsModal = () => {
  const { gameSettings: settings } = useAppSelector((state) => state.game.data);
  const { width } = useWindowSizeContext();
  const { closeGameModal } = useActions();
  const { isOpen } = useAppSelector((state) => state.gameModal);

  useEffect(() => {
    if (width < 640) return;

    closeGameModal();
  }, [width]);
  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => closeGameModal()}
        maxWidth="sm"
        fullWidth
      >
        <ModalBody>
          <ModalTitle onClose={() => closeGameModal()}>
            {/* Game Settings */}
          </ModalTitle>

          <GameWrapper>
            <GameTitle>Game Settings</GameTitle>
            <GameListWrapper>
              <GameListRow>
                <div>Game Mode</div>
                <div>{settings["Game Mode"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Game Type</div>
                <div>{settings["Game Type"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Trading Phase Time Limit</div>
                <div>{settings["Trading Phase Time Limit"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Abilities Phase Time Limit</div>
                <div>{settings["Abilities Phase Time Limit"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Max Players</div>
                <div>{settings["Max Players"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Max Shares</div>
                <div>{settings["Max Shares"]}</div>
              </GameListRow>

              <GameListRow>
                <div>Starting Cash</div>
                <div>{settings["Starting Cash"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Max Contracts</div>
                <div>{settings["Max Contracts"]}</div>
              </GameListRow>
              <GameListRow>
                <div>Naked Shorting</div>
                <div>{settings["Naked Shorting"]}</div>
              </GameListRow>
            </GameListWrapper>
          </GameWrapper>
        </ModalBody>
      </Modal>
    </>
  );
};

export default GameSettingsModal;
