import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAccountModalProps {
  isOpen: boolean;
  modalType: "login" | "register" | "logout";
}

const initialState: IAccountModalProps = {
  isOpen: false,
  modalType: "login",
};

const accountModalSlice = createSlice({
  name: "accountModal",
  initialState,
  reducers: {
    closeAccountModal: (state) => {
      state.isOpen = false;
    },
    openAccountModal: (state, action: PayloadAction<"login" | "register" | "logout">) => ({
      ...initialState,
      isOpen: true,
      modalType: action.payload,
    }),
  },
});

export const accountModalActions = accountModalSlice.actions;
export const accountModalReducer = accountModalSlice.reducer;
