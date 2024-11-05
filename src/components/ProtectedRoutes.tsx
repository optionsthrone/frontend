"use client";

import React from "react";
import Header from "./organism/Header/Header";

import { usePathname } from "next/navigation";
import { useActions, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAppSelector((state) => state.userInfo.isLoggedIn);
  const { toggleErrorSnackbar } = useActions();

  const protectedRoutes = ["/room/"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  React.useEffect(() => {
    if (isProtectedRoute && !isLoggedIn) {
      router.push("/");
      toggleErrorSnackbar({
        message: "You're not Authorized, Please Login",
      });
    }
  }, [isLoggedIn, isProtectedRoute, router]);

  return isProtectedRoute && isLoggedIn ? (
    <>{children}</>
  ) : (
    <>
      <Header />
      {children}
    </>
  );
}
