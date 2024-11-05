"use client";
import React from "react";

import { Box, SxProps } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import KickPlayer from "./kickPlayerModal";
import HelpDialog from "./helpModal";
import SettingsHelpDialog from "./settingsHelpModal";
import Settings from "../settings/settings";
import NotAllReadyModal from "./notAllReadyModal";

const styles: SxProps = {
  position: "absolute",
  top: 50,
  right: 0,
  zIndex: 1,
};

export default function RoomModal() {
  const isOpen = useAppSelector((state) => state.roomModal.isOpen);
  const modalType = useAppSelector((state) => state.roomModal.modalType);

  return isOpen ? (
    <Box sx={styles}>
      {modalType === "kickPlayer" && <KickPlayer />}
      {modalType === "help" && <HelpDialog />}
      {modalType === "settingsHelp" && <SettingsHelpDialog />}
      {modalType === "settings" && <Settings />}
      {modalType === "not all ready" && <NotAllReadyModal />}
      {/* {modalType === "chat" && <ChatModal />} */}
    </Box>
  ) : (
    <></>
  );
}
