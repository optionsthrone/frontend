import React from "react";
import { useAppSelector } from "@/store/hooks";
import TradeModal from "./modal/TradeModal";
import AbilityModal from "./modal/AbilityModal";
import { Box, SxProps } from "@mui/material";
import GameSettingsModal from "./modal/gameSettingsModal";
import OpenTradesModal from "./modal/openTradesModal";

const styles: SxProps = {
  position: "absolute",
  top: 50,
  right: 0,
  zIndex: 1,
};

export default function GameModal() {
  const { corporations } = useAppSelector((state) => state.game.data);
  const { isOpen, modalType } = useAppSelector((state) => state.gameModal);
  return isOpen ? (
    <Box sx={styles}>
      {modalType === "trade" && corporations && <TradeModal />}
      {modalType === "ability" && <AbilityModal />}
      {modalType === "game settings" && <GameSettingsModal />}
      {modalType === "open trades" && <OpenTradesModal />}
    </Box>
  ) : (
    <></>
  );
}
