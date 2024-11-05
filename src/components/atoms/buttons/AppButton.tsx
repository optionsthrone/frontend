import { Button, ButtonProps, styled } from "@mui/material";
import { keyframes } from "@mui/system";

const animationStyle = keyframes`
    from  {
        box-shadow:0 1px 4px rgba(255, 255, 255, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    }
    to {
        box-shadow:0 0 20px rgba(255, 255, 255, 0.8);
    }
`;

const ButtonWrapper = styled(Button)<{ isanimate: number; disabled: boolean }>(
  ({ isanimate, disabled }) => ({
    borderRadius: "40px",
    margin: "10px 0",
    fontSize: "0.7vw",
    textTransform: "none",
    "@media (max-width:640px)": {
      minWidth: "0rem",
      width: "fit-content",
      fontSize: "0.5rem",
      padding: "0.5vw 0.5rem",
      margin: "0 1rem",
    },

    "&.Mui-disabled": {
      color: "rgba(255, 255, 255, 0.26)",
      backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    transition: isanimate && !disabled ? "opacity 0.3s ease-in-out" : "",
    animation: isanimate && !disabled ? `${animationStyle} 2s infinite` : "",
  })
);

type IProps = {
  isAnimate?: boolean;
} & ButtonProps;

function AppButton({
  children,
  isAnimate = false,
  disabled = false,
  ...extraProps
}: IProps) {
  return (
    <ButtonWrapper {...extraProps} disabled={disabled} isanimate={+isAnimate}>
      {children}
    </ButtonWrapper>
  );
}

export default AppButton;
