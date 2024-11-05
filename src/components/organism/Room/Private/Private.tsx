import React from "react";
import { styled, Container } from "@mui/material";
import AppButton from "@/components/atoms/buttons/AppButton";
import FormWrapper from "@/components/atoms/form/FormWrapper";
import { useForm } from "react-hook-form";
import FormLevelInput from "@/components/atoms/form/FormLevelInput";
import { IRoomCode } from "@/types/interfaces/room/room";
import { usePrivateMutation } from "@/store/api/roomApi";
import { useActions, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

const PrivateRoomWrapper = styled(Container)({
  gap: "18px",
  margin: "20px 0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
});

export default function Private() {
  const router = useRouter();
  const [privateRoomAction, { isLoading }] = usePrivateMutation();
  const { token } = useAppSelector((state) => state.userInfo);
  const { toggleErrorSnackbar, toggleSuccessSnackbar } = useActions();

  const methods = useForm<IRoomCode>({
    defaultValues: {
      roomCode: "",
    },
  });
  const { handleSubmit, setError } = methods;

  const onSubmit = (formData: IRoomCode) => {
    const { roomCode } = formData;
    privateRoomAction({ roomCode, token })
      .unwrap()
      .then(() => {
        toggleSuccessSnackbar({
          message: "Joined successfully",
        });
        router.push(`room/${roomCode}`);
      })
      .catch((e) => {
        if (e.data) {
          toggleErrorSnackbar({
            message: e.data?.message || " Failed",
          });
          setError("root.roomCode", {
            type: "string",
            message: "Error: " + e.data.message,
          });
        }
      });
  };

  return (
    <PrivateRoomWrapper>
      <FormWrapper
        methods={methods}
        id="roomcode-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLevelInput
          fullWidth
          name="roomCode"
          placeholder="Enter Room Code"
          rules={{
            required: "Room code is Required",
          }}
        />
        <AppButton variant="contained" type="submit" disabled={isLoading}>
          {isLoading ? (
            <TailSpin color="#00BFFF" height="min(25px, 25px)" />
          ) : (
            "Join Room"
          )}
        </AppButton>
      </FormWrapper>
    </PrivateRoomWrapper>
  );
}
