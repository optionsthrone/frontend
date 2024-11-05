"use client";

import { useEffect, useState } from "react";

// window.visualViewport.width
function useWindowSize(delay: number) {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 500,
    height: 500,
  });
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function debounce(func: (...args: any[]) => void, delay: number) {
      let debounceTimer: NodeJS.Timeout;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: any[]) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
      };
    }

    const debouncedResize = debounce(() => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, delay);

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [delay]);

  return windowSize;
}

export default useWindowSize;
