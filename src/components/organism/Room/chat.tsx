import React from "react";
import Image from "next/image";
import chatIcon from "../../../playground_assets/chat-icon.png";
import { useActions } from "@/store/hooks";
import ChatModal from "./allRoomModals.tsx/chatModal";
import { IChat } from "@/types/interfaces/room/room";
interface IProps {
  showUnreadMessagesIndicator: boolean;
  chatLog: IChat[];
}
const Chat = ({ showUnreadMessagesIndicator, chatLog }: IProps) => {
  const { openChatModal } = useActions();

  return (
    <div className="chat-container">
      <div className="chat-btn-area">
        <div
          className="chat-btn"
          onClick={() => {
            openChatModal();
          }}
        >
          <div className="chat-icon">
            <ChatModal chatLog={chatLog} />
            {showUnreadMessagesIndicator && <div className="chat-bubble" />}
            <Image className="chat-img" src={chatIcon} alt="Chat" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
