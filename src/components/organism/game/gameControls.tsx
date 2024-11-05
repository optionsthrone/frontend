"use client";
import React from "react";
import AppButton from "@/components/atoms/buttons/AppButton";
import { useActions, useAppSelector } from "@/store/hooks";
import { Box, styled } from "@mui/material";

const GameWrapper = styled(Box)({
  padding: "20px 0",
  marginRight: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "end",
  width: "-webkit-fill-available",
  gap: "10px",
  "@media (max-width:640px)": {
    display: "none",
  },
});

type IProps = {
  // roomCode: string;
  currentPhase: string;
  // gameSettings: IGameSettings;
};

const GameControls = ({ currentPhase }: IProps) => {
  const { openGameModal } = useActions();
  const disableBtn = false;
  const { currentTurn } = useAppSelector((state) => state.game.data);

  const { setAdjust } = useActions();

  // useEffect(() => {
  //   const allPlayersSelectedAbility = Object.values(playerData).every(
  //     (player) => player.isAbilitySelected === true
  //   );

  //   if (allPlayersSelectedAbility) {
  //     sendMessage({
  //       action: constants.end_player_turn_action,
  //       payload: { roomCode: roomCode, currentPhase: currentPhase },
  //     });
  //   }
  // }, [playerData]);

  // const handleOnCountDownComplete = () => {
  //   setTimeout(() => {
  //     closeGameModal();
  //     sendMessage({
  //       action: constants.end_player_turn_action,
  //       payload: { roomCode: roomCode, currentPhase: currentPhase },
  //     });
  //   }, 0);
  // };

  // const getDuration = (): number => {
  //   if (phaseStartTimestamp && phaseEndTimestamp) {
  //     const startTimePart = phaseStartTimestamp.substring(9);
  //     const endTimePart = phaseEndTimestamp.substring(9);

  //     const formattedStartTime = moment(
  //       startTimePart,
  //       "HH:mm:ss:SSSSSS"
  //     ).format("HH:mm:ss");

  //     const formattedEndTime = moment(endTimePart, "HH:mm:ss:SSSSSS").format(
  //       "HH:mm:ss"
  //     );
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const startTimer: any = moment.duration(formattedStartTime, "minutes");
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const endTimer: any = moment.duration(formattedEndTime, "minutes");

  //     return (endTimer - startTimer) / 1000;
  //   }
  //   return 0;
  // };

  return (
    <>
      <GameWrapper>
        {/* <PhaseCountDown
          key={currentPhase}
          duration={getDuration()}
          size={100}
          onComplete={handleOnCountDownComplete}
        /> */}

        {
          <>
            <AppButton
              sx={{
                width: "7rem",
                backgroundColor: "black",
                border: "1px solid white",
                borderRadius: "5px",
                padding: "0.2rem 0rem",
                fontSize: " 1.5dvh",
                fontWeight: "800",
                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.8)",
              }}
              variant="contained"
              onClick={() => {
                setAdjust({
                  position: {
                    buyingPower: 0,
                    corporation: "",
                    coveringLeg: null,
                    primaryLeg: {
                      direction: "",
                      expiry: currentTurn + 1,
                      margin: false,
                      quantity: 1,
                      strike: 50,
                      type: "",
                      price: 0,
                    },
                  },
                  tradeType: "New Trade",
                });
                openGameModal("trade");
              }}
              // isAnimate
              disabled={disableBtn || currentPhase === "Abilities"}
            >
              Trade
            </AppButton>
            {/* <AppButton
                sx={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  openGameModal("ability");
                }}
                isAnimate
                disabled={
                  currentPhase !== "Abilities" ||
                  playerData[userName].isAbilitySelected
                }
              >
                Ability
              </AppButton> */}
            <AppButton
              sx={{
                width: "7rem",
                backgroundColor: "black",
                border: "1px solid white",
                borderRadius: "5px",
                padding: "0.2rem 0rem",
                fontSize: " 1.5dvh",
                fontWeight: "800",
                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.8)",
              }}
              variant="contained"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to leave the game?")
                ) {
                  window.location.href = "/";
                }
              }}
            >
              Leave Game
            </AppButton>
          </>
        }
      </GameWrapper>
    </>
  );
};

export default GameControls;
