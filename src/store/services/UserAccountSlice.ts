import { getUserInfo } from "@/utils/userUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserAccountType {
  token: string;
  userName: string;
  isLoggedIn: boolean;
  uuid: { userID: string };
}

const userInfo = getUserInfo();

const initialState: IUserAccountType = {
  token: userInfo?.token || "",
  userName: userInfo?.userName || "",
  isLoggedIn: !!userInfo?.token,
  uuid: userInfo?.uuid || "",
};

const userAccountSlice = createSlice({
  name: "userAccount",
  initialState,
  reducers: {
    setUserInfoAction: (state, action: PayloadAction<IUserAccountType>) => {
      return { ...action.payload };
    },
  },
});

export const userAccountActions = userAccountSlice.actions;
export const userAccountReducer = userAccountSlice.reducer;
