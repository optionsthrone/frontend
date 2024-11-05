"use client";
import React from "react";
import { styled, Box } from "@mui/material";
import { IGameSettings } from "@/types/interfaces/room/room";

const GameWrapper = styled(Box)({
  borderRadius: "1vh",
  boxShadow: "0 0 20px rgba(0,0,0,.3)",
  display: "flex",
  flexDirection: "column",
  margin: "10px",
  padding: "10px 15px",
  // width: "100%",
  // width: "max-content",
  alignSelf: "self-end",
  "@media (max-width:640px)": {
    display: "none",
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
  width: " fit-content",
});

const GameListRow = styled(Box)({
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, .2)",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "row",
  // height: "50px",
  justifyContent: "space-between",
  margin: "2px",
  padding: "10px 20px",
  fontSize: "0.65rem",
  gap: "2rem",

  "& div:first-of-type": {
    // color: "#42bda9",
    width: "60%",
    maxWidth: "60%",
  },
  "& div:last-child": {
    // color: "#c63e7c",
    width: "40%",
    maxWidth: "40%",
    textAlign: "end",
  },
  "@media (max-width:640px)": {
    height: "100%",
    padding: "0.4rem",
    fontSize: "0.5rem",
  },
});

const GameSettings = ({ settings }: { settings: IGameSettings }) => {
  // const [width, setWidth] = useState(window.innerWidth);
  // useEffect(() => {

  //     setWidth(window.innerWidth);

  // }, [window.innerWidth, window.innerHeight]);

  return (
    <>
      {
        <GameWrapper>
          <GameTitle>Game Settings</GameTitle>
          <GameListWrapper>
            {Object.entries(settings).map(
              ([key, value]) =>
                typeof value !== "object" && (
                  <GameListRow key={key}>
                    <div>{key}</div>|<div>{value}</div>
                  </GameListRow>
                )
            )}
          </GameListWrapper>
        </GameWrapper>
      }
    </>
  );
};

export default GameSettings;
