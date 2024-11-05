"use client";
import React from "react";
import { DialogTitle, styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitleProps } from "@mui/material/DialogTitle/DialogTitle";

interface IProps extends DialogTitleProps {
  onClose?: () => void;
}

const StyledDialogTitle = styled(DialogTitle)(() => ({
  // fontSize: "31px",
  textAlign: "left",
  // marginTop: "-20px",
  margin: "auto",
  maxWidth: "70vw",
  fontSize: "1.5rem",
  "@media (max-width:640px)": {
    maxWidth: "none",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "6%",
  right: "16%",
  color: theme.palette.grey[500],
  "@media (max-width:640px)": {
    right: 40,
    top: 40,
  },
}));

const ModalTitle = ({ children, onClose, ...extraProps }: IProps) => {
  return (
    <StyledDialogTitle {...extraProps}>
      {children}
      {onClose ? (
        <StyledIconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>
      ) : (
        <></>
      )}
    </StyledDialogTitle>
  );
};

export default ModalTitle;
