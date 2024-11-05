"use client";
import React, { useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";
import { useActions, useAppSelector } from "@/store/hooks";
import AllPlayersData from "../players";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";

const OpenTradesModal = () => {
  const { closeGameModal } = useActions();
  const { isOpen } = useAppSelector((state) => state.gameModal);

  const { width } = useWindowSizeContext();

  useEffect(() => {
    if (width < 640) return;

    closeGameModal();
  }, [width]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => closeGameModal()}
        maxWidth="sm"
        fullWidth
      >
        <ModalBody>
          <ModalTitle onClose={() => closeGameModal()}>Positions</ModalTitle>
          <AllPlayersData />
        </ModalBody>
      </Modal>
    </>
  );
};

export default OpenTradesModal;
