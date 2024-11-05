"use client";

import React from "react";
import { CloseOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useActions, useAppSelector } from "@/store/hooks";

function SettingsHelpDialog() {
  // get close modal reducer from store
  const { closeSettingsHelpModal } = useActions();

  // check if open

  const isSettingsOpen = useAppSelector(
    (state) => state.roomModal.isSettingsOpen
  );
  return (
    <div>
      <Dialog
        open={isSettingsOpen}
        onClose={() => {
          closeSettingsHelpModal();
        }}
        sx={{
          background: "transparent",
        }}
      >
        <DialogTitle style={{ cursor: "move" }} id="Help-dialog-title">
          Help with Settings
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Your Guide To Riches</DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton
            autoFocus
            onClick={() => {
              closeSettingsHelpModal();
            }}
            color="primary"
            sx={{
              position: "absolute",
              left: "2px%",
              top: "2px",

              color: "gray",
            }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SettingsHelpDialog;
