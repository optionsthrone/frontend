"use client";
import React from "react";
import Tab, { TabProps } from "@mui/material/Tab";
import { styled } from "@mui/material/styles";

interface IProps extends TabProps {
  index: number;
}

const StyledTab = styled(Tab)({
  fontSize: "16px",
  padding: "5px 10px",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  color: "#fff",
  transition: "background-color 0.5s ease-in-out",
  textTransform: "capitalize",
  "&.Mui-selected": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
  },
  "&:hover": {
    // boxShadow: '0 0 10px rgba(255, 255, 0, 1)'
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const a11yProps = (index: number) => {
  return {
    id: `hp-tab-${index}`,
    "aria-controls": `hp-tabpanel-${index}`,
  };
};

const TabMenuItem = ({ index, ...extraProps }: IProps) => {
  return <StyledTab {...extraProps} {...a11yProps(index)} />;
};

export default TabMenuItem;
