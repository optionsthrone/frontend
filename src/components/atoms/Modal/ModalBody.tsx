"use client";
import React from "react";
import { DialogContent, styled } from "@mui/material";
import { DialogContentProps } from "@mui/material/DialogContent/DialogContent";

const StyledDialogContent = styled(DialogContent)(() => ({
  // margin: "25px 0",
  padding: "25px 0",
  width: "calc(100vw - 64px)",
  height: "calc(100dvh - 64px)",
  maxHeight: "calc(100dvh - 64px)",
  maxWidth: "calc(100vw - 64px)",

  "@media (max-width:640px)": {
    padding: "3rem",
    height: "100vw",
    maxWidth: "unset",
  },
}));

const ModalBody = ({ children, ...extraProps }: DialogContentProps) => {
  return <StyledDialogContent {...extraProps}>{children}</StyledDialogContent>;
};

export default ModalBody;
