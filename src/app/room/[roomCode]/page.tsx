"use client";

import React from "react";
import { styled, Container } from "@mui/material";
import Room from "@/components/organism/Room/room";

const RoomWrapper = styled(Container)({
  color: "#fff",
  "@media (min-width:1200px)": {
    maxWidth: "none",
  },
});

export default function RoomPage({ params }: { params: { roomCode: string } }) {
  const roomCodeParam = params.roomCode;
  return (
    <>
      <RoomWrapper disableGutters={true}>
        <Room roomCodeParam={roomCodeParam} />
      </RoomWrapper>
    </>
  );
}
