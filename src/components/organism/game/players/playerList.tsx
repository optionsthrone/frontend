"use client";

import React from "react";
import { Box, styled } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IPosition } from "@/types/interfaces/game/game";
import { useActions } from "@/store/hooks";

type IPlayers = {
  [x: string]: {
    cash: number;
    positions: IPosition[];
    actionsPerformed?: boolean;
    afkStreak?: number;
    userName: string;
  };
};
interface IProps {
  players: IPlayers;
  setSelectedPlayer: Dispatch<SetStateAction<string>>;
}
const PlayerWrapper = styled(Box)({
  backgroundColor: "hsla(0, 0%, 100%, .1)",
  borderColor: "transparent",
  borderRadius: "0 0 5dvh 0",
  height: "15rem",
  padding: "0 2dvh 3dvh 0",
  position: "relative",
  width: "100%",
  "@media (max-width:640px)": {
    // height: "100%",
    padding: "0.3rem",
    width: "max-content",
  },
});

const PlayerListWrapper = styled(Box)({
  alignItems: "center",
  borderColor: "transparent",
  display: "flex",
  flexDirection: "column",
  // height: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  padding: "1dvh 0",
  width: "100%",
});

const PlayerRowButon = styled("button")({
  alignItems: "center",
  color: "#fff",
  display: "flex",
  flexDirection: "row",
  fontSize: "14px",
  justifyContent: "space-between",
  padding: "12px",
  width: "100%",
  boxShadow: "rgba(255, 0, 0, 0.5) 0px 0px 10px 2px",
  background: "none",
  "@media (max-width:640px)": {
    height: "max-content",
    width: "max-content",
    padding: "0.3rem",
    gap: "1rem",
  },
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
  },
});

const PlayerList = ({ players, setSelectedPlayer }: IProps) => {
  const { setDisplayPositionIndex } = useActions();
  return (
    players && (
      <PlayerWrapper>
        <PlayerListWrapper>
          {Object.keys(players).map((player, index) => (
            <PlayerRowButon
              key={player + index}
              onClick={(e) => {
                e.preventDefault();
                setDisplayPositionIndex(0);
                setSelectedPlayer(player);
              }}
            >
              <div>
                {players[player].cash && players[player].userName
                  ? players[player].cash.toLocaleString()
                  : "0"}
              </div>
              <div>{players[player].userName}</div>
            </PlayerRowButon>
          ))}
        </PlayerListWrapper>
      </PlayerWrapper>
    )
  );
};

export default PlayerList;
