import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { calibri_font } from "@/components/atoms/fonts/callit_fonts";
import "./globals.css";
import "@/components/organism/Room/room.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/themes/theme";
import "@/components/organism/gameboard/board.css";
import StoreProvider from "@/store/StoreProvider";
import dynamic from "next/dynamic";

// import slick carousel css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProtectedRoutes = dynamic(() => import("@/components/ProtectedRoutes"), {
  ssr: false,
});

import UiSnackbar from "@/components/atoms/SnackBar/SnackBar";
import { WindowSizeProvider } from "@/context/WindowSizeProvider";
export const metadata: Metadata = {
  title: "CallIt",
  description: "callit app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${calibri_font.className}`}>
        <StoreProvider>
          <WindowSizeProvider>
            <ThemeProvider theme={theme}>
              <ProtectedRoutes>
                {children}
                <UiSnackbar />
              </ProtectedRoutes>
            </ThemeProvider>
          </WindowSizeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
