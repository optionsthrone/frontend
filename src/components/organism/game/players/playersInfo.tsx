import React from "react";
import { useActions, useAppSelector } from "@/store/hooks";
import Position from "./position";
import AppButton from "@/components/atoms/buttons/AppButton";

interface IProps {
  selectedPlayer: string;
}
const PlayersInfo = ({ selectedPlayer }: IProps) => {
  const gameState = useAppSelector((state) => state.game.data);

  // get uuid from store
  const { uuid } = useAppSelector((state) => state.userInfo);

  // unique user uuid
  const userId = uuid.userID;

  const { displayPositionIndex } = useAppSelector((state) => state.gamePlay);

  const { setDisplayPositionIndex, setAdjust } = useActions();
  const { openGameModal } = useActions();

  return (
    <div>
      {selectedPlayer &&
        // gameState.playerData[selectedPlayer] &&
        gameState.playerData[selectedPlayer] && (
          <div className="positions-section">
            <h1 className="positions-header">
              {gameState.playerData[selectedPlayer].userName}
            </h1>
            {gameState.playerData[selectedPlayer]?.cash && (
              <h3 className="positions-cash">
                Cash:{" "}
                {"$" +
                  gameState.playerData[selectedPlayer]?.cash?.toLocaleString()}
              </h3>
            )}
            {gameState.playerData[selectedPlayer]?.positions?.length > 0 && (
              <div
                className="select-position-index"
                style={{ display: "flex", gap: "0.4rem" }}
              >
                <button
                  style={{
                    border: "0.5px solid white",
                    padding: "0.2rem 0.8rem",
                  }}
                  className={`select-position-index-btn ${
                    //   !gameInFocus ||
                    displayPositionIndex <= 0 ? "disabled" : "enabled"
                  }`}
                  disabled={
                    // !gameInFocus ||
                    displayPositionIndex <= 0
                  }
                  onClick={() => {
                    if (displayPositionIndex > 0) {
                      setDisplayPositionIndex(displayPositionIndex - 1);
                    }
                  }}
                >
                  {"<"}
                </button>
                <div className="select-position-index-text">
                  {displayPositionIndex + 1 >
                  gameState.playerData[selectedPlayer].positions.length
                    ? gameState.playerData[selectedPlayer].positions.length
                    : displayPositionIndex + 1}{" "}
                  / {gameState.playerData[selectedPlayer].positions.length}
                </div>
                <button
                  style={{
                    border: "0.5px solid white",
                    padding: "0.2rem 0.8rem",
                  }}
                  className={`select-position-index-btn ${
                    displayPositionIndex >=
                    gameState.playerData[selectedPlayer].positions.length - 1
                      ? "disabled"
                      : "enabled"
                  }`}
                  disabled={
                    displayPositionIndex >=
                    gameState.playerData[selectedPlayer].positions.length - 1
                  }
                  onClick={() => {
                    if (
                      displayPositionIndex <
                      gameState.playerData[selectedPlayer].positions.length - 1
                    ) {
                      setDisplayPositionIndex(displayPositionIndex + 1);
                    }
                  }}
                >
                  {">"}
                </button>
              </div>
            )}
            {gameState.playerData[selectedPlayer]?.positions?.[
              gameState.playerData[selectedPlayer]?.positions.length - 1
            ] && (
              <div
                key={selectedPlayer + displayPositionIndex}
                className="position"
              >
                <div className="position-card-and-btns">
                  <Position
                    position={
                      gameState.playerData[selectedPlayer]?.positions[
                        displayPositionIndex + 1 >=
                        gameState.playerData[selectedPlayer]?.positions.length
                          ? gameState.playerData[selectedPlayer]?.positions
                              .length - 1
                          : displayPositionIndex
                      ]
                    }
                    gameState={gameState}
                  />
                  {selectedPlayer === userId && (
                    <div className="position-btns">
                      <div
                        className="position-btns-row"
                        style={{ display: "flex", gap: "0.8rem" }}
                      >
                        <AppButton
                          variant="contained"
                          // className={`close-position-btn`}
                          disabled={gameState.currentPhase === "Abilities"}
                          onClick={() => {
                            setAdjust({
                              position:
                                gameState.playerData[userId].positions[
                                  displayPositionIndex
                                ],
                              tradeType: "close",
                            });
                            openGameModal("trade");
                          }}
                        >
                          Close
                        </AppButton>
                        <AppButton
                          variant="contained"
                          className={`open-more-position-btn`}
                          sx={{
                            padding: "0.2rem 0.7rem",
                          }}
                          disabled={gameState.currentPhase === "Abilities"}
                          onClick={() => {
                            setAdjust({
                              position:
                                gameState.playerData[userId].positions[
                                  displayPositionIndex
                                ],
                              tradeType: "open more",
                            });
                            openGameModal("trade");
                          }}
                        >
                          Open More
                        </AppButton>
                      </div>
                      {/* TODO: uncomment and implement below */}
                      {/* {gameState.playerData[selectedPlayer].positions[
                              displayPositionIndex
                            ].coveringLeg === null && (
                              <div className="position-btns-row">
                                <button
                                  className="build-combo-position-btn"
                                  onClick={() => {
                                    setAdjust({
                                      position:
                                        gameState.playerData[userName]
                                          .positions[displayPositionIndex],
                                      type: "cover",
                                    });
                                  }}
                                >
                                  Build A Covered Position
                                </button>
                              </div>
                            )} */}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default PlayersInfo;
