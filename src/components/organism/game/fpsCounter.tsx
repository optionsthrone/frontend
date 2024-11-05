import React, { useEffect, useState } from "react";

/**
 * A functional component that displays the current frames per second (FPS) in real-time.
 * It uses the `requestAnimationFrame` and `setInterval` APIs to calculate the FPS.
 *
 * @returns {React.FC} - A React functional component that renders the FPS value.
 */
const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    // let lastTime = performance.now();
    const times: number[] = [];

    /**
     * The refresh loop function that updates the FPS value every second.
     * It uses the `requestAnimationFrame` API to run at the browser's refresh rate.
     */
    const refreshLoop = () => {
      const now = performance.now();

      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);

      requestAnimationFrame(refreshLoop);
    };

    /**
     * The interval function that updates the FPS value every second.
     * It uses the `setInterval` API to run every 1000 milliseconds.
     */
    const interval = setInterval(() => {
      setFps(times.length);
    }, 1000);

    refreshLoop();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        color: "#fff",
      }}
    >
      FPS: {fps}
    </div>
  );
};

export default FPSCounter;
