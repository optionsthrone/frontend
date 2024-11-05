"use client";

import React from "react";

import { Container, styled } from "@mui/material";
import Nav from "./Nav";

const HeaderWrapper = styled(Container)({
  width: "100vw",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "1.5rem 1rem",
  "@media (min-width: 481px) and (max-width: 767px)": {
    justifyContent: "space-between",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    justifyContent: "space-between",
  },
});

export default function Header() {
  return (
    <HeaderWrapper>
      <Nav />
    </HeaderWrapper>
  );
}
