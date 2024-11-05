import { jwtDecode } from "jwt-decode";

export const setUserInfo = (payload: { token: string; userName: string }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        token: payload.token,
        userName: payload.userName,
        uuid: jwtDecode(payload.token),
      })
    );
  } else {
    return;
  }
};

export const getUserInfo = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("userInfo") || "{}");
  } else {
    return null;
  }
};

export const isUserLoggedIn = () => {
  const user = getUserInfo();
  return !!user?.token;
};

export const getUserToken = () => {
  const user = getUserInfo();
  return user?.token;
};

export const logout = () => {
  localStorage.removeItem("userInfo");
};

export const userNamePattern = (val: string) => {
  return /^[a-zA-Z0-9]+$/.test(val);
};

export const emailPatten = /\S+@\S+\.\S+/;
