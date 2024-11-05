"use client";

import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ActiveEvents from "./activeEvents";
import Image from "next/image";
import { useActions, useAppSelector } from "@/store/hooks";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  maxWidth: "100%",
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "@media (max-width:640px)": {
    margin: "auto",
    // height: "50vh",
    writingMode: "tb-rl",
    transform: "rotate(-180deg)",
    overflowX: "auto",
    justifyContent: "start",
    padding: "0.4rem 0",
  },
}));
const CustomIconButton = styled(IconButton)(() => ({
  "@media (max-width:640px)": {
    bottom: "8px",
    top: "auto",
  },
}));
const corporationName: ["BGBO", "MGCR", "CBRT", "Global", "EDSC"] = [
  "BGBO",
  "MGCR",
  "CBRT",
  "Global",
  "EDSC",
];
export default function CardModal() {
  // get game info from the store
  const { activeEvents, currentTurn } = useAppSelector(
    (state) => state.game.data
  );

  // toggle active events modal
  const isOpen = useAppSelector((state) => state.activeEvent.isOpen);

  const { closeActiveEventModal, openActiveEventModal } = useActions();

  useEffect(() => {
    if (
      Object.keys(activeEvents["CBRT"].cards).length > 0 ||
      Object.keys(activeEvents["EDSC"].cards).length > 0 ||
      Object.keys(activeEvents["MGCR"].cards).length > 0 ||
      Object.keys(activeEvents["BGBO"].cards).length > 0 ||
      Object.keys(activeEvents["Global"].cards).length > 0
    ) {
      openActiveEventModal();
    }
  }, [currentTurn]);
  // const cardImage =
  //   diceRoll === "BGBO"
  //     ? "/images/card-backs/BGBO.webp"
  //     : diceRoll === "CBRT"
  //     ? "/images/card-backs/CBRT.webp"
  //     : diceRoll === "MGCR"
  //     ? "/images/card-backs/MGCR.webp"
  //     : diceRoll === "EDSC"
  //     ? "/images/card-backs/EDSC.webp"
  //     : "/images/card-backs/Global.webp";

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <CustomDialog
        fullWidth
        onClose={() => {
          closeActiveEventModal();
        }}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              maxWidth: "max-content", // Set your width here
            },
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          style={{
            background: "black",
            color: "white",
          }}
        >
          Active Events
        </DialogTitle>
        <CustomIconButton
          aria-label="close"
          onClick={() => {
            closeActiveEventModal();
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[100],
          }}
        >
          <CloseIcon />
        </CustomIconButton>
        <DialogContent
          dividers
          style={{
            background: "black",
            color: "white",
            maxWidth: "100%",
          }}
        >
          <div className="modal_body">
            <div className="modal_card">
              <div className="flex">
                {corporationName.map((corporation) =>
                  Object.keys(activeEvents[corporation].cards).map(
                    (cardAction, i) => {
                      const card = activeEvents[corporation].cards[cardAction];

                      if (card) {
                        return (
                          <div className="middle-active-event" key={i}>
                            <Image
                              src={`/images/card-backs/${corporation}.webp`}
                              alt="corporation"
                              width={100}
                              height={100}
                              className="active_image"
                            />
                            <ActiveEvents
                              name={card.name}
                              action={card.action}
                              text={card.text}
                            />{" "}
                          </div>
                        );
                      }

                      return null;
                    }
                  )
                )}
              </div>
              <div className="flex">
                {corporationName.some(
                  (corporation) =>
                    activeEvents[corporation].abilities.Gaze?.extraData?.card
                ) && (
                  <div className="middle-active-events-row">
                    <h1
                      className="middle-active-events-title"
                      style={{ color: "white" }}
                    >
                      Gaze
                    </h1>
                    {corporationName.map(
                      (corporation, i) =>
                        activeEvents[corporation].abilities.Gaze?.extraData
                          ?.card && (
                          <div className="middle-active-event" key={i}>
                            <Image
                              src={`/images/card-backs/${corporation}.webp`}
                              alt="corporation"
                              width={100}
                              height={100}
                              className="active_image"
                            />
                            <ActiveEvents
                              name={
                                activeEvents[corporation].abilities.Gaze
                                  ?.extraData?.card.name
                              }
                              action={
                                activeEvents[corporation].abilities.Gaze
                                  ?.extraData?.card.action
                              }
                              text={
                                activeEvents[corporation].abilities.Gaze
                                  ?.extraData?.card.text
                              }
                            />
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </CustomDialog>
    </React.Fragment>
  );
}
