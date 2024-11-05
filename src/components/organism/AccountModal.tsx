"use client";
import React from "react";

import { Box, SxProps } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Logout from "./Logout/Logout";

const styles: SxProps = {
  position: "absolute",
  top: 50,
  right: 0,
  zIndex: 1,
};

export default function AccountModal() {
  const isOpen = useAppSelector((state) => state.accountModal.isOpen);
  const modalType = useAppSelector((state) => state.accountModal.modalType);

  return isOpen ? (
    <Box sx={styles}>
      {modalType === "logout" && <Logout />}
      {modalType === "login" && <Login />}
      {modalType === "register" && <Register />}
    </Box>
  ) : (
    <></>
  );
}
