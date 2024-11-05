"use client";

import React from "react";
import { Snackbar, styled } from "@mui/material";

import AlertError from "@/components/atoms/alerts/AlertErrors";
import AlertInfo from "@/components/atoms/alerts/AlertInfo";
import AlertSuccess from "@/components/atoms/alerts/AlertSuccess";
import DismissButton from "@/components/atoms/buttons/DismissButton";
import { useAppSelector, useActions } from "@/store/hooks";

const SnackbarWrapper = styled(Snackbar)({
  "@media (max-width:640px)": {
    transform: "rotate(180deg)",
    writingMode: "vertical-lr",
    width: "3rem",
    // right: "0 !important",
    left: "auto !important",
  },
});

const UiSnackbar = () => {
  const snackbarState = useAppSelector((state) => state.snackbar);
  const { toggleCloseSnackbar } = useActions();

  const alterMap = {
    error: AlertError,
    success: AlertSuccess,
    info: AlertInfo,
  };

  const AlertComponent = alterMap[snackbarState.status!];

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    toggleCloseSnackbar();
  };

  return (
    <SnackbarWrapper
      open={snackbarState.isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <AlertComponent
        onClose={handleClose}
        elevation={20}
        message={snackbarState.message!}
        action={<DismissButton onClick={handleClose} />}
      />
    </SnackbarWrapper>
  );
};

export default UiSnackbar;
