"use client";

import React from "react";
import { useActions, useAppSelector } from "@/store/hooks";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { constants } from "./roomConstants/constants";

const ChangeRoom = () => {
  // get roomstat from store
  const roomState = useAppSelector((state) => state.room);

  // get username from store
  const userName = useAppSelector((state) => state.userInfo.userName);

  // send message
  const [sendMessage] = useSendMessageMutation();

  //   change room
  const { setActionPending, changeRoom } = useActions();

  const handleRoomTypeToggle = async () => {
    changeRoom();

    const payload = {
      roomType: roomState.roomType === "private" ? "public" : "private",
      roomCode: roomState.roomCode,
    };
    setActionPending(constants.room_type_action);
    const action = constants.room_type_action;
    // console.log({ action, payload });

    sendMessage({ action, payload });
  };
  return (
    <div className="public-private-toggle-area">
      <button
        disabled={userName !== roomState.hostUserName}
        className={`public-private-toggle ${
          roomState.roomType === "public"
            ? userName === roomState.hostUserName
              ? "public"
              : "public-disabled"
            : userName === roomState.hostUserName
            ? "private"
            : "private-disabled"
        }`}
        onClick={handleRoomTypeToggle}
      >
        {roomState.roomType}
      </button>
    </div>
  );
};

export default ChangeRoom;
