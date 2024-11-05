"use client";

import PhaseCountDown from "@/components/atoms/progress/PhaseCountDown";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useActions, useAppSelector } from "@/store/hooks";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { constants } from "./gameConstants/constants";
import Loader from "./loader";

const Timer = () => {
  let hasCompleted = false;
  const [showLoader, setShowLoader] = useState(false);
  const { closeGameModal } = useActions();
  const [sendMessage] = useSendMessageMutation();
  const {
    roomCode,
    phaseEndTimestamp,
    phaseStartTimestamp,
    currentPhase,
    currentTurn,
  } = useAppSelector((state) => state.game.data);

  const getDuration = (): number => {
    if (phaseStartTimestamp && phaseEndTimestamp) {
      const endTimePart = phaseEndTimestamp;

      // Parse the timestamps using ISO 8601 format
      const startMoment = moment();

      const endMoment = moment(endTimePart);

      if (startMoment.isValid() && endMoment.isValid()) {
        const duration = moment.duration(endMoment.diff(startMoment));

        if (Math.round(duration.asSeconds()) < 0) {
          return 0;
        }

        return Math.round(duration.asSeconds());
      }
    }

    return 0;
  };
  useEffect(() => {
    hasCompleted = false;
    const startDuration = moment.duration(
      moment().diff(moment(phaseStartTimestamp))
    );
    if (startDuration.asSeconds() < 0) {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, startDuration.asSeconds());
    } else {
      setShowLoader(false);
    }
  }, [phaseEndTimestamp]);

  const handleOnCountDownComplete = () => {
    // console.log(currentPhase, hasCompleted);

    if (hasCompleted) return;
    hasCompleted = true;

    setTimeout(() => {
      closeGameModal();
      sendMessage({
        action: constants.end_player_turn_action,
        payload: { roomCode: roomCode, currentPhase: currentPhase },
      });
    }, 0);
  };

  return (
    <>
      {(getDuration() === 0 || showLoader) && <Loader />}
      {/* <Loader /> */}
      <div className="timer">
        <PhaseCountDown
          key={currentPhase + currentTurn}
          duration={getDuration()}
          size={100}
          onComplete={handleOnCountDownComplete}
        />
      </div>
    </>
  );
};

export default Timer;
