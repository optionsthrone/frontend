"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useWindowSizeContext } from "@/context/WindowSizeProvider";

const Spiral = ({
  turnTracker,
  children,
}: {
  children: JSX.Element;
  turnTracker: number;
}) => {
  // canvas reference
  const canvasRef = useRef(null);
  // get tracker reference
  const trackerElement = useRef<HTMLImageElement | null>(null);

  // get width and height from window custom hoook
  const { width, height } = useWindowSizeContext();

  const [turnTrackerTransforms, setTurnTrackerTransforms] = useState<
    { x: number; y: number; angle: number }[]
  >([]);

  const widthFactor = width > 640 ? 0.5 : 1;

  // Calculate the values in pixels for large screens
  const widthInPixels = width * widthFactor; // 50vw
  const heightInPixels = height * 0.9; // 90vh

  // Get the minimum value
  const minDimension = Math.min(widthInPixels, heightInPixels);

  // get container dimensions in both mobile and desktop screens
  const containerWidth = 0.5 * minDimension;

  // number of turns plus 2
  const I = 32;
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = containerWidth / 2;
    const centerY = containerWidth / 2;
    const radius = containerWidth / 1.6;
    const coils = 7.25;
    const rotation = 2 * Math.PI;
    const thetaMax = coils * 2 * Math.PI;
    const awayStep = radius / thetaMax;
    const chord = containerWidth / 7;

    const new_time = [];
    let theta = (chord / awayStep) * 1.82;
    for (let i = 0; i <= I; i++) {
      const away = awayStep * theta;
      const around = rotation - theta; // Subtract rotation for anti-clockwise

      const x = centerX + Math.cos(around) * away - containerWidth / 40;
      const y = centerY + Math.sin(around) * away - containerWidth / 40;

      theta += chord / away;

      new_time.push({ x, y, angle: around });
    }

    // Scale the canvas for high DPI displays
    const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = containerWidth * scale;
    canvas.height = containerWidth * scale;

    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerWidth}px`;
    ctx.scale(scale, scale);

    // Draw the spiral path
    for (let i = 0; i < new_time.length - 1; i++) {
      const xc = (new_time[i].x + new_time[i + 1].x) / 2;
      const yc = (new_time[i].y + new_time[i + 1].y) / 2;

      // Set line width and color for each segment
      if (i !== 0) {
        ctx.lineWidth = containerWidth / 13; // Set the thickness of the line
        ctx.strokeStyle = `#e61275`; // Set the color of the line
      }
      if (I - i - 1 !== 31) {
        ctx.quadraticCurveTo(new_time[i].x, new_time[i].y, xc, yc);
      }

      ctx.stroke(); // Draw the current segment
      ctx.lineTo(xc, yc);

      // Create a linear gradient for each segment
      const gradient = ctx.createLinearGradient(
        new_time[i].x,
        new_time[i].y,
        xc,
        yc
      );
      if ([30, 25, 20, 15, 10, 5, 0].includes(i - 1)) {
        gradient.addColorStop(0, `#A23590`); // Start color
        gradient.addColorStop(0.5, `#A23590`); // Middle color
        gradient.addColorStop(0.9, `#A23590`); // Middle color
      } else {
        gradient.addColorStop(0, `white`); // Start color
        gradient.addColorStop(0.5, `white`); // Middle color
        gradient.addColorStop(0.9, `white`); // Middle color
      }
      gradient.addColorStop(1, "#e61275"); // End color

      ctx.lineWidth = containerWidth / 14;
      ctx.strokeStyle = gradient;
      ctx.stroke();

      ctx.beginPath(); // Start a new path for the next segment
      ctx.moveTo(xc, yc); // Move to the end of the current segment
    }

    // Draw the numbers on the spiral
    new_time.forEach((point, index) => {
      ctx.save(); // Save the current state
      ctx.translate(point.x, point.y); // Move to the point
      ctx.rotate(point.angle + Math.PI / 2); // Rotate to the angle of the point plus 90 degrees
      ctx.font = `bold ${containerWidth / 30}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "hanging";
      ctx.fillStyle = "black";
      if (index !== 0 && index !== 32) {
        if (I - index - 1 === 0) {
          ctx.fillText("IPO", 0, 0); // Draw text at the origin after translation
        } else {
          ctx.fillText(`${I - index - 1}`, 0, 0); // Draw text at the origin after translation
        }
      }
      ctx.restore(); // Restore the previous state
    });
    setTurnTrackerTransforms(new_time);
  }, [width, height]);

  useEffect(() => {
    if (
      !trackerElement ||
      !trackerElement.current ||
      !turnTrackerTransforms.length
    )
      return;
    trackerElement.current.style.top = `${
      turnTrackerTransforms[I - turnTracker - 1].y - containerWidth / 29
    }px`;
    trackerElement.current.style.left = `${
      turnTrackerTransforms[I - turnTracker - 1].x - containerWidth / 29
    }px`;
  }, [turnTracker, turnTrackerTransforms]);

  return (
    <>
      <div className="boxes mid-image">
        <Image
          className="callit_logo"
          src="/images/boardLogo.svg"
          alt="callit logo"
          width={100}
          height={100}
          priority
        />
      </div>
      <div className="spiral-body boxes">
        <div className="spiral__node">
          <div className="global">{children}</div>
          <canvas
            ref={canvasRef}
            className="spiral-container"
            id="spiral-container"
          ></canvas>

          <Image
            className="turnTracker"
            src="/images/priceTrackers/turnTracker.webp"
            alt="callit logo"
            ref={trackerElement}
            width={100}
            height={100}
          />
        </div>
      </div>
    </>
  );
};

export default Spiral;
