"use client";

import React, { useRef, useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { TailSpin } from "react-loader-spinner";
import { useSendMessageMutation } from "@/store/api/socketApi";
import { useActions, useAppSelector } from "@/store/hooks";
import moment from "moment";
import { constants } from "../roomConstants/constants";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { IChat } from "@/types/interfaces/room/room";

interface ChatModalProps {
  chatLog: IChat[];
}

const ChatModal: React.FC<ChatModalProps> = ({ chatLog }) => {
  // Store selectors
  const userName = useAppSelector((state) => state.userInfo.userName);
  const roomState = useAppSelector((state) => state.room);
  const isOpen = useAppSelector((state) => state.chatModal.isOpen);

  // Local state
  const [message, setMessage] = useState<string>(""); // The typed message
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<
    string | null
  >(null); // Last message sent timestamp
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Refs
  const chatBoxRef = useRef<HTMLUListElement>(null);

  // RTK Query mutation
  const [sendMessage] = useSendMessageMutation();

  // Actions
  const { updateChatlog, closeChatModal } = useActions();

  /**
   * Helper function to format the timestamp of a message into a human-readable time ago format.
   */
  const formatTimestamp = (timestamp: string): string => {
    return moment(timestamp).local().fromNow();
  };

  /**
   * Handles sending a chat message, ensuring there's no spam (sending within 1 second).
   */
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const currentDateTime = new Date();
    const lastMessageTime = lastMessageTimestamp
      ? new Date(lastMessageTimestamp)
      : null;

    // Prevent sending if message is empty or if it's sent within 1 second
    if (
      !message.trim() ||
      (lastMessageTime &&
        currentDateTime.getTime() - lastMessageTime.getTime() < 1000)
    ) {
      return;
    }

    const newTimestamp = currentDateTime.toISOString();
    setLastMessageTimestamp(newTimestamp);

    const newChatLog = {
      userName,
      message,
      timestamp: newTimestamp,
    };

    updateChatlog(newChatLog);
    scrollToBottom();
    sendMessageToServer(message);
    setMessage(""); // Clear message input
  };

  /**
   * Sends the chat message to the WebSocket server via RTK Query.
   */
  const sendMessageToServer = (newMessage: string) => {
    const payload = {
      roomCode: roomState.roomCode,
      message: newMessage,
    };

    setIsLoading(true);
    sendMessage({ action: constants.chat_action, payload }).finally(() => {
      setIsLoading(false);
    });
  };

  /**
   * Scrolls the chat box to the bottom.
   */
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  /**
   * Scrolls to the bottom when the chat log is updated or the modal is opened.
   */
  useEffect(() => {
    scrollToBottom();
  }, [chatLog, isOpen]);

  if (!isOpen) return null;

  return (
    <ClickAwayListener
      onClickAway={() => {
        closeChatModal();
      }}
    >
      <div className="chat-area">
        <ul className="chat-box" id="chat" ref={chatBoxRef}>
          {chatLog[0]?.userName &&
            chatLog.map((chatMessage, index) => (
              <li
                className={chatMessage.userName === userName ? "me" : "you"}
                key={index}
              >
                <div className="details">
                  <h3 className="time">
                    {formatTimestamp(chatMessage.timestamp)}
                  </h3>
                  <h2 className="username">
                    {chatMessage.userName === userName
                      ? "You"
                      : chatMessage.userName}
                  </h2>
                  <span
                    className={`status ${
                      chatMessage.userName === userName ? "blue" : "green"
                    }`}
                  ></span>
                </div>
                <div className="message">{chatMessage.message}</div>
              </li>
            ))}
        </ul>

        <form className="chat-input" onSubmit={handleSendChatMessage}>
          <input
            type="text"
            className="chat-input-textbox"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-input-submit"
            disabled={!message.trim() || isLoading}
            style={{
              opacity: !message.trim() || isLoading ? 0.8 : 1,
              pointerEvents: !message.trim() || isLoading ? "none" : "auto",
            }}
          >
            {isLoading ? (
              <TailSpin color="#00BFFF" height="min(2dvh, 2vw)" />
            ) : (
              <SendIcon />
            )}
          </button>
        </form>
      </div>
    </ClickAwayListener>
  );
};

export default ChatModal;
