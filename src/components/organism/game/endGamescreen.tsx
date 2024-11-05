"use client";

import React from "react";
import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import {
  Julius_Sans_One_font,
  quicksand_font,
  Sansation_Light_font,
} from "@/components/atoms/fonts/callit_fonts";

import { useRouter } from "next/navigation";
import { IPlayerData } from "@/types/interfaces/game/game";

const EndGamescreen = () => {
  const router = useRouter();
  const MainEndGameWrapper = styled(Box)({
    width: "100vw",
    height: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: "#fff",
    position: "absolute",
    top: "0%",
    zIndex: "9999",
    insetArea: "center",
    background: "#0000006e",
  });
  const EndGameWrapper = styled(Box)({
    width: "85vw",
    height: "90dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: "#fff",
    margin: "auto",
    zIndex: "9999",
    insetArea: "center",
    background:
      "conic-gradient(from 5.98deg at 70.8% 30.52%, #672F7D 0deg, #281A4D 162deg, #091B3F 189deg, #0C3779 295.2deg, #672F7D 360deg)",
    "@media (max-width:640px)": {
      flexDirection: "column-reverse",
    },
  });
  const PlayerListWrapper = styled(Box)({
    width: "35%",
    height: "80%",
    background: "linear-gradient(180deg, #892E80 0%, #281A4D 100%)",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
    gap: "3.5%",
    paddingTop: "10%",
    "@media (max-width:640px)": {
      width: "80%",
      height: "100%",
    },
  });
  const PlayerInfoWrapper = styled(Box)({
    width: "80%",
    height: "6%",
    background: "#521A52CC",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: "1rem",
    fontFamily: `${quicksand_font.style.fontFamily}`,
  });
  const WinnerWrapper = styled(Box)({
    width: "40%",
    height: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#fff",
    textAlign: "center",
    gap: "1rem",
    "@media (max-width:640px)": {
      width: "100%",
    },
  });
  const GameLogWrapper = styled(Box)({
    width: "100%",
    height: "30%",
    position: "absolute",
    bottom: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#fff",
    background: "#D9D9D905",
  });
  const GameTextWrapper = styled(Box)({
    overflowY: "auto",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  });
  const GameLogHeader = styled(Box)({
    width: " 85%",
    marginBottom: "3%",
    fontFamily: `${Julius_Sans_One_font.style.fontFamily}`,
    fontSize: "0.8rem",
  });
  const GameLogText = styled(Box)({
    fontSize: "0.7rem",
    width: "55%",
    fontFamily: `${Sansation_Light_font.style.fontFamily}`,
  });
  const TextShadowWrapper = styled(Typography)({
    textShadow: "2px 2px black",
    fontFamily: `${quicksand_font.style.fontFamily}`,
  });

  // get the playerdata from the store
  const { playerData, gameLog, roomCode } = useAppSelector(
    (state) => state.game.data
  );

  //converting the object to an array
  const values = Object.values(playerData);
  const maxCash = values.reduce((max, player) =>
    max.cash > player.cash ? max : player
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasValue = (obj: IPlayerData, value: any) =>
    Object.keys(obj).filter((key) => obj[key] == value);
  hasValue(playerData, maxCash);

  return (
    <MainEndGameWrapper>
      <EndGameWrapper>
        <PlayerListWrapper>
          {Object.entries(playerData).map(([player, playerDatas], i) => (
            <PlayerInfoWrapper key={i}>
              <TextShadowWrapper
                style={{
                  fontSize: "0.65rem",
                }}
              >
                {playerDatas.userName}
              </TextShadowWrapper>
              <TextShadowWrapper
                style={{
                  fontSize: "0.65rem",
                }}
              >
                ---
              </TextShadowWrapper>
              <TextShadowWrapper
                style={{
                  fontSize: "0.65rem",
                }}
              >
                $
                {playerData[player].cash
                  ? playerData[player].cash.toLocaleString()
                  : ""}
              </TextShadowWrapper>
            </PlayerInfoWrapper>
          ))}

          <GameLogWrapper>
            <GameLogHeader>Gamelog</GameLogHeader>
            <GameTextWrapper>
              {gameLog?.map((log, i) => (
                <GameLogText key={i}>{log}</GameLogText>
              ))}
            </GameTextWrapper>
          </GameLogWrapper>
        </PlayerListWrapper>
        <WinnerWrapper>
          <Image
            src={"/images/crown.webp"}
            alt="Winner's crown"
            width={200}
            height={300}
            style={{
              width: "50%",
              animation: "bounce 2s infinite",
              transition: "fade 2s infinite",
            }}
          />
          <TextShadowWrapper
            style={{
              fontSize: "2rem",
            }}
          >
            WINNER
          </TextShadowWrapper>
          <PlayerInfoWrapper>
            <TextShadowWrapper style={{ fontSize: "1.2rem" }}>
              {maxCash.userName}
            </TextShadowWrapper>
            <TextShadowWrapper style={{ fontSize: "1.2rem" }}>
              ---
            </TextShadowWrapper>
            <TextShadowWrapper style={{ fontSize: "1.2rem" }}>
              ${maxCash.cash}
            </TextShadowWrapper>
          </PlayerInfoWrapper>
          <GameLogText>
            "We don’t have to be smarter than the rest. We have to be more
            disciplined than the rest."
          </GameLogText>
          <GameLogText> — Warren Buffett</GameLogText>
          <button
            style={{
              position: "absolute",
              bottom: "10%",
              padding: "1rem 2rem",
              backgroundColor: "#281A4D",
              color: "#fff",
              fontFamily: `${quicksand_font.style.fontFamily}`,
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              borderRadius: "10px",
            }}
            onClick={() => router.push(`/room/${roomCode}`)}
          >
            Continue
          </button>{" "}
        </WinnerWrapper>
      </EndGameWrapper>
    </MainEndGameWrapper>
  );
};

export default EndGamescreen;
