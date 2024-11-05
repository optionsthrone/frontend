import { useAppSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import PlayerList from "./playerList";
import PlayersInfo from "./playersInfo";

const AllPlayersData = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const { playerData } = useAppSelector((state) => state.game.data);

  // get uuid from store
  const { uuid } = useAppSelector((state) => state.userInfo);
  useEffect(() => {
    setSelectedPlayer(uuid.userID);
  }, []);
  return (
    <>
      <PlayerList players={playerData} setSelectedPlayer={setSelectedPlayer} />
      <PlayersInfo selectedPlayer={selectedPlayer} />
    </>
  );
};

export default AllPlayersData;
