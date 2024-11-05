"use client";
import React, { createContext, ReactNode, useContext } from "react";
import useWindowSize from "@/custom-hooks/useWindowSize";

interface WindowSizeContextProps {
  width: number;
  height: number;
}

const WindowSizeContext = createContext<WindowSizeContextProps | undefined>(
  undefined
);

export const WindowSizeProvider = ({ children }: { children: ReactNode }) => {
  const windowSize = useWindowSize(300);
  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowSizeContext = () => {
  const context = useContext(WindowSizeContext);
  if (context === undefined) {
    throw new Error(
      "useWindowSizeContext must be used within a WindowSizeProvider"
    );
  }
  return context;
};
