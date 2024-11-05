import React from "react";
import { styled } from "@mui/material/styles";
import { Alert } from "@mui/material";
import { AlertProps } from "@mui/material/Alert";

interface IProps extends AlertProps {
  message: string;
}

const AlertError = React.forwardRef<HTMLDivElement, IProps>(function TestAlert(
  props,
  ref
) {
  const StyledAlertError = styled(Alert)({
    width: "100%",
    backgroundColor: "#DF43B6",
    padding: "10px 16px",
    letterSpacing: "0.5px",
    "& .MuiAlert-icon": {
      fontSize: "24px",
      padding: "6px 0px",
      marginRight: "8px",
    },
  });

  return (
    <StyledAlertError
      severity={"warning"}
      variant={"filled"}
      className={"error"}
      ref={ref}
      {...props}
    >
      {props.message}
    </StyledAlertError>
  );
});

export default AlertError;
