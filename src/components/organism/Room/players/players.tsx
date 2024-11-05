"use client";

import React from "react";
import { useActions, useAppSelector } from "@/store/hooks";

const Players = () => {
  // get roomstate from store
  const roomState = useAppSelector((state) => state.room);

  // get username from store
  const { userName } = useAppSelector((state) => state.userInfo);

  // open kickplayer modal
  const { openRoomModal, setPlayerToKick } = useActions();

  return (
    <div className="player-list">
      <div className="player-list-header">
        <h1>Players</h1>
        <div className="player-count">
          {`${roomState.playerCount}/${roomState.gameSettings["Max Players"]}`}
        </div>
      </div>
      <div className="player-list-players">
        {Object.entries(roomState.playerData).map(
          ([playerUserName, playerIndividualData]) => {
            return (
              <div className="player-list-player-row" key={playerUserName}>
                <div className="player-list-player-name-section">
                  <button
                    className="kick-player-btn"
                    disabled={
                      userName !== roomState.hostUserName ||
                      userName === playerIndividualData.userName
                    }
                    style={{
                      opacity:
                        userName === roomState.hostUserName &&
                        userName !== playerIndividualData.userName
                          ? 1
                          : 0,
                      pointerEvents:
                        userName === roomState.hostUserName &&
                        userName !== playerIndividualData.userName
                          ? "auto"
                          : "none",
                    }}
                    onClick={() => {
                      openRoomModal("kickPlayer");
                      setPlayerToKick(playerUserName);
                    }}
                  >
                    {/* {showKickPlayerSpinner ? (
                    <TailSpin color="#00BFFF" height="min(1.8vh, 1.8vw)" />
                  ) : (
                    "Kick"
                  )} */}
                    Kick
                  </button>

                  <div className="player-list-player-name">
                    {playerIndividualData.userName.length > 12
                      ? playerIndividualData.userName.slice(0, 10) + "..."
                      : playerIndividualData.userName}
                  </div>
                </div>

                <div
                  className={`player-list-player-ready ${
                    playerIndividualData.readyState === "host"
                      ? "host"
                      : playerIndividualData.readyState === "ready"
                      ? "ready"
                      : "not-ready"
                  }`}
                >
                  {playerIndividualData.readyState === "host"
                    ? "Host"
                    : playerIndividualData.readyState === "ready"
                    ? "Ready"
                    : "Not Ready"}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Players;
