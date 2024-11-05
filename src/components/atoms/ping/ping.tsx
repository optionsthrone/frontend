/**
 * A React functional component that displays the current ping to the server.
 * It calculates the ping time based on the timestamps received from the Redux store.
 * The ping time is displayed with different colors based on its value.
 *
 * @returns {React.FC} A React functional component that renders the ping time.
 */
"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

const Ping = () => {
  /**
   * The received and sent timestamps from the Redux store.
   *
   * @type {{ receivedTimestamp: number, sentTimestamp: number }}
   */
  const { receivedTimestamp, sentTimestamp } = useAppSelector(
    (state) => state.ping
  );

  /**
   * The calculated ping time in milliseconds.
   *
   * @type {number}
   */
  const [pingMs, setPingMs] = useState(0);

  useEffect(() => {
    setPingMs(receivedTimestamp - sentTimestamp);
  }, [receivedTimestamp]);

  return (
    <div className="ping">
      Ping :{" "}
      <span
        style={{
          color: `${pingMs > 700 ? "red" : pingMs > 350 ? "yellow" : "green"}`,
        }}
      >
        {`${pingMs} ms`}
      </span>{" "}
    </div>
  );
};

export default Ping;
