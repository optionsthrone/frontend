import React from "react";

import { ThreeDots } from "react-loader-spinner";
import { Box, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/store/api/accountApi";
import FormWrapper from "@/components/atoms/form/FormWrapper";
import FormLevelInput from "@/components/atoms/form/FormLevelInput";
import { setUserInfo } from "@/utils/userUtils";
import { useActions } from "@/store/hooks";
import { ILoginForm } from "@/types/interfaces/auth/auth";
import AppButton from "@/components/atoms/buttons/AppButton";
import { jwtDecode } from "jwt-decode";

const LoginWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
});

export default function Login() {
  const [userLoginAction, { isLoading }] = useLoginMutation();
  const {
    toggleErrorSnackbar,
    toggleSuccessSnackbar,
    setUserInfoAction,
    closeAccountModal,
  } = useActions();

  const methods = useForm<ILoginForm>();
  const { handleSubmit, setError } = methods;

  const onSubmit = (formData: ILoginForm) => {
    userLoginAction(formData)
      .unwrap()
      .then((res) => {
        toggleSuccessSnackbar({
          message: res.message,
        });
        setUserInfo(res);
        setUserInfoAction({
          token: res.token,
          userName: res.userName,
          isLoggedIn: true,
          uuid: jwtDecode(res.token),
        });
        closeAccountModal();
      })
      .catch((e) => {
        if (e.data) {
          const fieldError = e.data.message?.toLowerCase();
          if (fieldError.includes("user")) {
            setError("root.userName", {
              type: "string",
              message: e.data.message,
            });
          } else if (fieldError.includes("password")) {
            setError("root.password", {
              type: "string",
              message: e.data.message,
            });
          }
        } else {
          toggleErrorSnackbar({
            message: e.data?.message || "Login Failed",
          });
        }
      });
  };

  return (
    <FormWrapper
      methods={methods}
      id="login-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoading ? (
        <ThreeDots />
      ) : (
        <LoginWrapper>
          <FormLevelInput
            fullWidth
            name="userName"
            placeholder="Username or Email"
            rules={{
              required: "Username is Required",
            }}
          />
          <FormLevelInput
            fullWidth
            type="password"
            name="password"
            placeholder="Password"
            rules={{ required: "Password is Required" }}
          />
          <AppButton variant="contained" type="submit" disabled={isLoading}>
            Submit
          </AppButton>
        </LoginWrapper>
      )}
    </FormWrapper>
  );
}
