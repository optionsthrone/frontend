"use client";

import React, { useEffect, useRef } from "react";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";

const RandomWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSizeContext();
  let hasCompleted = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasCompleted) return;

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(
      new URL("/workers/waveWorker.ts", import.meta.url)
    );

    worker.postMessage({ canvas: offscreen, width, height }, [offscreen]);
    hasCompleted = true;
    return () => {
      // worker.terminate();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="waveCanvas"
      width={width / 10}
      height={height / 40}
    ></canvas>
  );
};

export default RandomWave;
