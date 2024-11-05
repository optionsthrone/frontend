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

function HelpDialog() {
  // get close modal reducer from store
  const { closeRoomModal } = useActions();

  // check if open
  const isOpen = useAppSelector((state) => state.roomModal.isOpen);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => {
          closeRoomModal();
        }}
        sx={{
          background: "transparent",
        }}
      >
        <DialogTitle style={{ cursor: "move" }} id="Help-dialog-title">
          Help
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Your Guide To Riches</DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton
            autoFocus
            onClick={() => {
              closeRoomModal();
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

export default HelpDialog;
