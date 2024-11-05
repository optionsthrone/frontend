import React from "react";
import { useRouter } from "next/navigation";

import AppButton from "@/components/atoms/buttons/AppButton";
import { Container, styled } from "@mui/material";
import { useHostMutation } from "@/store/api/roomApi";
import { useActions, useAppSelector } from "@/store/hooks";
import { TailSpin } from "react-loader-spinner";

const HostRoomWrapper = styled(Container)({
  gap: "18px",
  margin: "20px 0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
});

export default function Host() {
  const router = useRouter();
  const [createHostAction, { isLoading }] = useHostMutation();
  const { token } = useAppSelector(state => state.userInfo);
  const { toggleErrorSnackbar } = useActions();


  const handleCreateHost = () => {
    createHostAction({ token })
      .unwrap()
      .then((res) => {
        if (res) {
          router.push(`/room/${res.roomCode}`);
        }
      })
      .catch((e) => {
        if (e.data) {
          toggleErrorSnackbar({
            message: e.data.message,
          });
        }
      });
  };

  return (
    <HostRoomWrapper>
      <h2 style={{ color: "#fff" }}>Create a new Public Room</h2>
      <AppButton
        variant="contained"
        onClick={handleCreateHost}
        disabled={isLoading}
      >
        {
          isLoading ? (
            <TailSpin color="#00BFFF" height="min(25px, 25px)" />
          ) : (
            "Create Room"
          )
        }
      </AppButton>
    </HostRoomWrapper>
  );
}