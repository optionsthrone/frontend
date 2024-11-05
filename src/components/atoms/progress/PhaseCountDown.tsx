import { useActions, useAppSelector } from "@/store/hooks";
import {
  Box,
  CircularProgress,
  CircularProgressProps,
  circularProgressClasses,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const StyledCiruclarProgressBar = styled(Box)({
  position: "relative",
  display: "inline-flex",
  //   marginRight: "20px",
  margin: "auto",
  color: "#fff",
  // padding: "20px 50px"
  "& span": {
    width: "6rem !important",
    height: "6rem !important",
    "@media (max-width:840px)": {
      width: "3rem !important",
      height: "3rem !important",
    },
  },
});

type IProps = {
  duration: number;
  onComplete: () => void;
} & CircularProgressProps;

const PhaseCountDown = ({ duration, onComplete }: IProps) => {
  const { toggleInfoSnackbar } = useActions();
  const { currentPhase } = useAppSelector((state) => state.game.data);
  const [timeDuration, setTimeDuration] = useState(duration);
  const [countdownText, setCountdownText] = useState("");
  const [countdownPercentage, setCountdownPercentage] = useState(100);
  // const [displayCss, setDisplayCss] = useState("");

  useEffect(() => {
    toggleInfoSnackbar({
      message: `${currentPhase} phase is active`,
    });
    if (!currentPhase) return;
    const intervalId = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTimeDuration((prev: any) => {
        // if (prev === 0) {
        //   clearInterval(intervalId);
        //   // setDisplayCss("none");
        //   onComplete();
        //   return 0;
        // }
        const newTimeDuration = prev - 1;

        const percentage = Math.ceil((newTimeDuration / timeDuration) * 100);
        // console.log(newTimeDuration, prev, percentage, duration);
        setCountdownPercentage(percentage);

        if (newTimeDuration <= 0) {
          clearInterval(intervalId);
          // setDisplayCss("none");

          onComplete();
          return 0;
        }

        return newTimeDuration;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // const minutes = Math.floor(timeDuration / 60);
    const seconds = timeDuration;
    setCountdownText(`${seconds < 10 ? "0" + seconds : seconds}`);
  }, [timeDuration]);

  return (
    <StyledCiruclarProgressBar
    // sx={{
    //   display: displayCss,
    // }}
    >
      <CircularProgress
        variant="determinate"
        size={300}
        value={countdownPercentage}
        sx={(theme) => ({
          color: theme.palette.grey[200],
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
            stroke: theme.palette.success,
            strokeWidth: 2,
            border: "1px solid red",
          },
        })}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.white">
          {`${countdownText}s`}
        </Typography>
      </Box>
    </StyledCiruclarProgressBar>
  );
};

export default PhaseCountDown;
