import React from "react";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";

const StyledTabs = styled(Tabs)({
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50px',
  "& .MuiTabs-flexContainer": {
    gap: "14px",
  },
  "& .MuiTabs-indicator": {
    display: "none",
    backgroundColor: "#18768C",
  },
});

const TabMenu = ({ children, ...extraProps }: TabsProps) => {
  return <StyledTabs {...extraProps}>{children}</StyledTabs>;
};

export default TabMenu;
