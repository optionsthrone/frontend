import React from "react";
import { styled, Box } from "@mui/material";
import { useAppSelector } from "@/store/hooks";

const GameWrapper = styled(Box)({
  boxShadow: "0 0 20px rgba(0,0,0,.3)",
  display: "flex",
  flexDirection: "column",
  padding: "0.5rem",
  width: "35vw",
  minWidth: "35vw",
  height: "100%",
  overflowX: "auto",
  color: "#ffffffcc",
  background: "#ffffff1a",
  borderRadius: " 0 0 min(10dvh, 10vw) 0",
});

const GameTitle = styled("h2")({
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

const GameListWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "1vh",
});

const GameListRow = styled(Box)({
  alignItems: "center",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  fontSize: "1.6vh",
  fontWeight: "bold",
  padding: "0px 0.1rem",
  width: "100%",
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  "@media (max-width:640px)": {
    fontSize: "1vh",
    // height: "100%",
    // padding: "0.3rem",
    // fontSize: "0.5rem",
  },
});

const GameSettings = () => {
  // get gameState from store
  const roomState = useAppSelector((state) => state.room);
  const settings = roomState.gameSettings;

  return (
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
          <div>Starting Cash</div>
          <div>{settings["Starting Cash"].toLocaleString()}</div>
        </GameListRow>
        <GameListRow>
          <div>Max Players</div>
          <div>{settings["Max Players"]}</div>
        </GameListRow>
        <GameListRow>
          <div>Trading Phase Time Limit</div>
          <div>{settings["Trading Phase Time Limit"]} sec.</div>
        </GameListRow>
        <GameListRow>
          <div>Abilities Phase Time Limit</div>
          <div>{settings["Abilities Phase Time Limit"]} sec.</div>
        </GameListRow>
        {Object.keys(settings.Abilities).map((ability, i) => (
          <GameListRow key={i}>
            <div>{ability}</div>
            <div>{settings.Abilities[ability]}</div>
          </GameListRow>
        ))}
      </GameListWrapper>
    </GameWrapper>
  );
};

export default GameSettings;
