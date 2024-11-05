import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ISendData } from "@/types/interfaces/room/room";
import { gameActions } from "../services/gameSlice";
import { roomActions } from "../services/roomSlice";
import { gameStatusActions } from "../services/gameStatus";
import { pingActions } from "../services/pingSlice";
import { RootState } from "../store";
import { actions } from "../hooks";
import { getUserToken } from "@/utils/userUtils";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { chatMessagesActions } from "../services/chatActions";

// WebSocket constants
const GET_ROOM_STATE_ACTION = "get_room_state";
const HEARTBEAT_ACTION = "heartbeat";
const HEARTBEAT_INTERVAL = 2 * 60 * 500; // 2 minutes in milliseconds
const WEBSOCKET_API_DOMAIN = process.env.NEXT_PUBLIC_APP_WSAPI_URL;

let socketInstance: WebSocket;
const messageQueue: ISendData[] = [];
let currentAction: string;
let isProcessingQueue = false;
let mockQueue: ISendData[] = [];
let userName: string;

/**
 * Initializes a WebSocket connection.
 */
const createSocket = (roomCode: string, token: string): WebSocket => {
  return new WebSocket(
    `${WEBSOCKET_API_DOMAIN}?roomCode=${roomCode}&token=${token}`
  );
};

/**
 * Sends data over the WebSocket connection.
 */
const sendData = async (data: ISendData) => {
  const token = getUserToken();
  if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
    const payload = { ...data.payload, token };
    const message = JSON.stringify({ action: data.action, payload });
    socketInstance.send(message);
    console.log("Request sent:", message);
  } else {
    console.error("WebSocket not connected");
    // Dispatch an error status if the WebSocket is not connected
  }
};

/**
 * Processes the queue sequentially, ensuring only one request is sent at a time.
 */
const processQueue = async () => {
  if (isProcessingQueue || messageQueue.length === 0) return;

  isProcessingQueue = true;
  const data = messageQueue.shift();
  if (data) {
    currentAction = data.action;
    await sendData(data);
  }
};

/**
 * Handles queue processing completion.
 */
const handleQueueCompletion = () => {
  isProcessingQueue = false;
  if (messageQueue.length > 0) {
    processQueue(); // Continue processing the next request in the queue
  }
};

/**
 * Sets up WebSocket event listeners.
 */
const setupWebSocketListeners = (
  ws: WebSocket,
  roomCode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCachedData: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, UnknownAction>
) => {
  ws.addEventListener("open", () => {
    console.log("WebSocket connection established");
    sendData({ action: GET_ROOM_STATE_ACTION, payload: { roomCode } });

    // Send heartbeat messages periodically
    setInterval(() => {
      sendData({ action: HEARTBEAT_ACTION, payload: { roomCode } });
      dispatch(actions.setSentTimestamp(Date.now()));
    }, HEARTBEAT_INTERVAL);
  });

  ws.addEventListener("close", () => {
    console.log("WebSocket disconnected");
    // Dispatch an error status for disconnection
    // dispatch(
    //   gameStatusActions.setGameStatus({
    //     type: "error",
    //     message: "WebSocket disconnected",
    //   })
    // );
  });

  ws.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
    // Dispatch an error status for the WebSocket error
    dispatch(
      gameStatusActions.setGameStatus({
        type: "error",
        message: "WebSocket connection error",
      })
    );
  });

  ws.addEventListener("message", (event: MessageEvent) => {
    handleWebSocketMessage(event.data, dispatch);

    handleQueueCompletion(); // Allow the next request in the queue to proceed
  });

  // Close the WebSocket connection if the URL hash changes or the user navigates away
  ["hashchange", "popstate", "beforeunload"].forEach((event) =>
    window.addEventListener(event, () => {
      if (window.location.pathname === "/") {
        console.log("WebSocket connection closed");
        ws.close();
      }
    })
  );
};

/**
 * Handles incoming WebSocket messages.
 */
const handleWebSocketMessage = (
  data: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // updateCachedData: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, UnknownAction>
) => {
  const parsedData = JSON.parse(data);
  console.log("Response received:", parsedData);

  if (parsedData.message === "Heartbeat acknowledged") {
    dispatch(pingActions.setReceivedTimestamp(Date.now()));

    return;
  }

  if (
    (!parsedData.data && !parsedData.dataType) ||
    parsedData.type === "error"
  ) {
    handleError(parsedData, dispatch);
    return;
  }

  if (parsedData.message !== "Heartbeat acknowledged" && parsedData.message) {
    dispatch(gameStatusActions.setGameStatus(parsedData));
  }
  if (parsedData.dataType) {
    updateStateByDataType(parsedData, dispatch);
  }
  // updateCachedData(() => {
  //   console.log("i reached here");

  //   if (parsedData.dataType) {
  //     updateStateByDataType(parsedData, dispatch);
  //   }
  //   return parsedData;
  // });
};

/**
 * Handles errors in WebSocket messages.
 */
const handleError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, UnknownAction>
) => {
  if (data.type === "error" && data.message) {
    mockQueue = [];
    dispatch(gameStatusActions.setGameStatus(data));
    if (messageQueue.length > 0) {
      dispatch(
        socketsApi.endpoints.sendMessage.initiate({
          ...messageQueue[0],
          queue: true,
        })
      );
    }
  }
};

/**
 * Updates the Redux store based on the data type.
 */
const updateStateByDataType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, UnknownAction>
) => {
  switch (data.dataType) {
    case "room_state":
      dispatch(roomActions.setRoomState(data.data));
      break;
    case "game_state":
      dispatch(gameActions.setGameState(data));
      break;
    case "chat":
      dispatch(chatMessagesActions.setChatState(data.data));
      break;
    default:
      break;
  }

  if (
    (currentAction === "end_player_turn" &&
      currentAction === data.updatedByAction) ||
    (currentAction === data.updatedByAction &&
      userName === data.updatedByUserName)
  ) {
    mockQueue = [];
    if (messageQueue.length > 0) {
      dispatch(
        socketsApi.endpoints.sendMessage.initiate({
          ...messageQueue[0],
          queue: true,
        })
      );
    }
  }
};

export const socketsApi = createApi({
  reducerPath: "socketApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["socket"],
  endpoints: (build) => ({
    sendMessage: build.mutation<string, ISendData>({
      queryFn: async (message, api) => {
        const state = api.getState() as RootState;
        userName = state.userInfo.userName;

        if (message.action === "chat") {
          await sendData(message);
          return { data: "Message sent" };
        }

        if (message.queue) {
          processQueue();
          return { data: "Next message processed" };
        }

        messageQueue.push(message);
        mockQueue.push(message);

        if (!isProcessingQueue) {
          processQueue();
        }

        return { data: "Message queued" };
      },
    }),

    setupSocket: build.query({
      query: ({ roomCode }) => ({
        url: `room/${roomCode}`,
        responseHandler: (response) => response.text(),
      }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        { roomCode },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        socketInstance = createSocket(roomCode, getUserToken());
        setupWebSocketListeners(
          socketInstance,
          roomCode,
          updateCachedData,
          dispatch
        );

        try {
          await cacheDataLoaded;
        } catch (error) {
          console.error("Failed to load cache data:", error);
          dispatch(
            gameStatusActions.setGameStatus({
              type: "error",
              message: "Failed to load cache data",
            })
          );
        }

        await cacheEntryRemoved;
        // socketInstance.close();
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => ({
        data: response,
        isLoading: false,
        isError: false,
      }),
    }),
  }),
});

export const socketInvalidateTags = socketsApi.util.invalidateTags;
export const { useSetupSocketQuery, useSendMessageMutation } = socketsApi;
