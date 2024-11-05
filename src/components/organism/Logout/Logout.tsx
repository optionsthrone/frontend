import { useActions } from "@/store/hooks";
import { styled, Box, Button } from "@mui/material";
import { logout } from "@/utils/userUtils";

const LogoutWrapper = styled(Box)({
  width: "100px",
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
});

const ButtonWrapper = styled(Button)({
  padding: "5px",
  backgroundImage: "linear-gradient(to bottom, teal, #0f3d93)",
  backgroundColor: "teal",
});

export default function Logout() {
  const { toggleSuccessSnackbar, setUserInfoAction, closeAccountModal } =
    useActions();
  return (
    <LogoutWrapper>
      <ButtonWrapper
        variant="contained"
        onClick={() => {
          logout();
          setUserInfoAction({
            token: "",
            userName: "",
            isLoggedIn: false,
            uuid: {
              userID: "",
            },
          });
          toggleSuccessSnackbar({
            message: "User Logout Successfully",
          });
          closeAccountModal();
        }}
      >
        Logout
      </ButtonWrapper>
    </LogoutWrapper>
  );
}
