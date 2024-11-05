import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserResponse } from "./apiTypes";
import { ILoginForm, IRegisterForm } from "@/types/interfaces/auth/auth";

const baseUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/user/`;

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["callit"],
  endpoints: (build) => ({
    login: build.mutation<UserResponse, ILoginForm>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    register: build.mutation<UserResponse, IRegisterForm>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = accountApi;
