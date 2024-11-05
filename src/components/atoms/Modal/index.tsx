"use client";
import React from "react";
import { Dialog, styled, Box } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog/Dialog";

const FirstModalWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100dvh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "@media (max-width:640px)": {
    position: "relative",
    width: "100%",
    height: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
const SecondModalWrapper = styled(Box)({
  height: "100%",
  outline: "0",
  display: "flex",
  // WebkitBoxPack: "center",
  // MsFlexPack: "center",
  // WebkitJustifyContent: "center",
  justifyContent: "center",
  // WebkitAlignItems: "center",
  // WebkitBoxAlign: "center",
  // MsFlexAlign: "center",
  // alignItems: "center",
  transform: "rotate(0deg)",
  position: "absolute",
  minHeight: "100dvh",
  maxHeight: "100dvh",
  maxWidth: "100vw",
  width: "100vw",
  minWidth: "100vw",
  "@media (max-width:640px)": {
    height: "100%",
    outline: "0",
    display: "flex",
    WebkitBoxPack: "center",
    MsFlexPack: "center",
    WebkitJustifyContent: "center",
    justifyContent: "center",
    WebkitAlignItems: "center",
    WebkitBoxAlign: "center",
    MsFlexAlign: "center",
    alignItems: "center",
    transform: "rotate(-90deg)",
    position: "absolute",
    minHeight: "100vw",
    maxHeight: "100vw",
    maxWidth: "100dvh",
    width: "100dvh",
    minWidth: "100dvh",
  },
});
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    padding: "0 25px",
    borderRadius: "8px",
    minWidth: "70vw",
    backgroundColor: "#000",
    boxShadow: "0 0 10px 10px rgba(255,0,0,.5)",
    color: "#fff",
    margin: 0,
    // maxHeight: "100dvh",
    maxWidth: "70vw",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    maxHeight: "90vh",
    // height: "-webkit-fill-available",
    "@media (max-width:640px)": {
      maxWidth: "100vw",
      // transform: "rotate(-90deg)",
      // height: "90vw",
      // width: "90vh",
      // minWidth: "90vh",
    },
  },
}));

const Modal = ({ children, ...extraProps }: DialogProps) => {
  return (
    <StyledDialog {...extraProps}>
      <FirstModalWrapper>
        <SecondModalWrapper>{children}</SecondModalWrapper>
      </FirstModalWrapper>
    </StyledDialog>
  );
};

export default Modal;
