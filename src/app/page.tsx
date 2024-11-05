"use client";

import TabContent from "@/components/atoms/Tab/TabContent";
import TabMenu from "@/components/atoms/Tab/TabMenu";
import TabMenuItem from "@/components/atoms/Tab/TabMenuItem";
import { Box, styled, Container } from "@mui/material";
import { useState } from "react";
import { Public, Private, Host } from "@/components/organism/Room";
import { useActions } from "@/store/hooks";

const MainWrapper = styled(Container)({
  width: "700px",
  margin: "0px auto",
  "@media (min-width: 481px) and (max-width: 767px)": {
    width: "auto",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    width: "auto",
  },
});

const MainHeaderWrapper = styled(Box)({
  width: "300px",
  margin: "15px auto",
});

const StyledTabContentWrapper = styled(Box)({});
const StyledTabContent = styled(Box)({});
const VersionWrapper = styled(Box)({
  color: "rgba(255, 255, 255, 0.5)",
  position: "absolute",
  bottom: "10px",

  left: "1vw",
});

const host = [
  {
    id: 1,
    name: "public",
  },
  {
    id: 2,
    name: "private",
  },
  {
    id: 3,
    name: "host",
  },
];

const ComponentMap = ({ id }: { id: string }) => {
  const mapObject = {
    public: <Public />,
    private: <Private />,
    host: <Host />,
  };
  const objKey = id as keyof typeof mapObject;
  return mapObject[objKey];
};

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const { roomsInvalidateTags } = useActions();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      roomsInvalidateTags(["rooms"]);
    }
    setTabValue(newValue);
  };

  return (
    <MainWrapper>
      <Box>
        <MainHeaderWrapper>
          {!!host.length && (
            <TabMenu value={tabValue} onChange={handleTabChange}>
              {host.map((item, index) => (
                <TabMenuItem key={index} index={index} label={item.name} />
              ))}
            </TabMenu>
          )}
        </MainHeaderWrapper>
        <StyledTabContentWrapper>
          {host.map((item, index) => {
            return (
              <StyledTabContent key={index}>
                <TabContent index={index} value={tabValue}>
                  <ComponentMap id={item.name} />
                </TabContent>
              </StyledTabContent>
            );
          })}
        </StyledTabContentWrapper>
      </Box>
      <VersionWrapper>v0.1.0-alpha</VersionWrapper>
    </MainWrapper>
  );
}
