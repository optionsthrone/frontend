import React from "react";

import { Box, styled } from "@mui/material";

import { ThreeDots } from "react-loader-spinner";
import FormWrapper from "@/components/atoms/form/FormWrapper";
import { useRegisterMutation } from "@/store/api/accountApi";
import { useForm } from "react-hook-form";
import { IRegisterForm } from "@/types/interfaces/auth/auth";
import FormLevelInput from "@/components/atoms/form/FormLevelInput";
import { useActions } from "@/store/hooks";
import { emailPatten, setUserInfo, userNamePattern } from "@/utils/userUtils";
import AppButton from "@/components/atoms/buttons/AppButton";
import { jwtDecode } from "jwt-decode";

const RegisterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
});

export default function Register() {
  const [userRegisterAction, { isLoading }] = useRegisterMutation();
  const {
    toggleErrorSnackbar,
    toggleSuccessSnackbar,
    setUserInfoAction,
    closeAccountModal,
  } = useActions();
  const methods = useForm<IRegisterForm>();
  const { handleSubmit, setError, watch } = methods;

  const passwordWatch = watch("password");
  const usernameWatch = watch("userName");

  const onSubmit = (formData: IRegisterForm) => {
    userRegisterAction(formData)
      .unwrap()
      .then((res) => {
        toggleSuccessSnackbar({
          message: res.message,
        });
        // Set Local UserInfo
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
          if (fieldError.includes("username")) {
            setError("root.userName", {
              type: "string",
              message: e.data.message,
            });
          } else if (fieldError.includes("email")) {
            setError("root.email", {
              type: "string",
              message: e.data.message,
            });
          } else {
            toggleErrorSnackbar({
              message: e.data?.message || "Register Failed",
            });
          }
        }
      });
  };

  return (
    <FormWrapper
      methods={methods}
      id="register-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoading ? (
        <ThreeDots />
      ) : (
        <RegisterWrapper>
          <FormLevelInput
            name="userName"
            placeholder="Username"
            rules={{
              required: "Username is Required",
              validate: {
                matchPattern: (v) =>
                  userNamePattern(v) ||
                  "Username must contain only letters and numbers",
              },
            }}
          />
          <FormLevelInput
            name="email"
            placeholder="email"
            rules={{
              required: "Email is Required",
              pattern: {
                value: emailPatten,
                message: "Invalid Email Format",
              },
            }}
          />
          <FormLevelInput
            type="password"
            name="password"
            placeholder="password"
            rules={{
              required: "Password is Required",
              validate: (value) =>
                !(value === usernameWatch) ||
                "Password cannot be the same as Username",
            }}
          />
          <FormLevelInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            rules={{
              required: "Password is Required",
              validate: (value) =>
                value === passwordWatch || "The passwords do not match",
            }}
          />
          <AppButton variant="contained" type="submit" disabled={isLoading}>
            Submit
          </AppButton>
        </RegisterWrapper>
      )}
    </FormWrapper>
  );
}
