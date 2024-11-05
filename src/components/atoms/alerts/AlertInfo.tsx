import React from "react";
import { Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AlertProps } from "@mui/material/Alert";

interface IProps extends AlertProps {
  message: string;
}

const AlertInfo = React.forwardRef<HTMLDivElement, IProps>(function AlertInfo(
  props,
  ref
) {
  const StyledAlertInfo = styled(Alert)({
    width: "100%",
    backgroundColor: "#197E95",
    padding: "10px 16px",
    letterSpacing: "0.5px",
    "& .MuiAlert-icon": {
      fontSize: "24px",
      padding: "6px 0px",
      marginRight: "8px",
    },
  });

  return (
    <StyledAlertInfo
      severity={"info"}
      variant={"filled"}
      className={"success"}
      ref={ref}
      {...props}
    >
      {props.message}
    </StyledAlertInfo>
  );
});

export default AlertInfo;
