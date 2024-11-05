import React from "react";
import { useAppSelector } from "@/store/hooks";

const CurrentPlayerSection = () => {
  const { currentPlayer } = useAppSelector((state) => state.game.data);
  return <h1 className="current-player-turn-header">{currentPlayer}'s Turn</h1>;
};

export default CurrentPlayerSection;
