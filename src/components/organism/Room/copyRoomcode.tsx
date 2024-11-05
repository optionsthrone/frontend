"use client";

import React, { useState } from "react";

import { useAppSelector } from "@/store/hooks";

const CopyRoomcode = () => {
  // change text state
  const [copyText, setCopyText] = useState("Click to copy");

  // get roomstate from store
  const roomState = useAppSelector((state) => state.room);

  //   perfor copy text action
  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(roomState.roomCode);
    setCopyText("✓ Copied!");
    setTimeout(() => {
      setCopyText("Click to copy");
    }, 2000);
  };
  return (
    <button className="roomCodeBtn" onClick={handleCopyButtonClick}>
      <span className="room-code-text">Room Code</span>
      <span className="room-code">{roomState.roomCode}</span>
      <span className="copy-to-clipboard">{copyText}</span>
    </button>
  );
};

export default CopyRoomcode;
