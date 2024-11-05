import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HostRequest, HostResponse } from "./apiTypes";
import { getUserToken } from "@/utils/userUtils";
import { IRooms } from "@/types/interfaces/room/room";

const baseUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/room/`;
const token = getUserToken();
export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers) {
      if (token) {
        headers.set("authorization", token);
      }
      return headers;
    },
  }),
  tagTypes: ["rooms"],
  endpoints: (build) => ({
    getRooms: build.query<IRooms[], void>({
      query: () => "getrooms",
      providesTags: ["rooms"],
    }),
    host: build.mutation<HostResponse, HostRequest>({
      query: (token) => ({
        url: "newroom",
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["rooms"],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private: build.mutation<any, any>({
      query: (arg) => {
        return {
          url: "joinroom",
          method: "POST",
          body: {
            token: arg.token,
            roomCode: arg.roomCode,
          },
        };
      },
      invalidatesTags: ["rooms"],
    }),
  }),
});

export const roomsInvalidateTags = roomApi.util.invalidateTags;

export const { useGetRoomsQuery, useHostMutation, usePrivateMutation } =
  roomApi;
