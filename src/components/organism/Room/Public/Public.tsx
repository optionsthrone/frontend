import React, { useEffect, useState } from "react";
import { Box, Container, styled } from "@mui/material";
import { useGetRoomsQuery } from "@/store/api/roomApi";
import { TailSpin } from "react-loader-spinner";
import { IRooms } from "@/types/interfaces/room/room";
import CustomTableContainer from "@/components/atoms/table/CustomTableContainer";
import { MRT_ColumnFiltersState } from "material-react-table";
import FilterDropdown from "@/components/atoms/Dropdown/FilterDropdown";
import { IDropdownType } from "@/types/interfaces/commonTypes/commonTypes";
import { GameFilterType } from "@/types/interfaces/game/game";
import AppButton from "@/components/atoms/buttons/AppButton";
import { useActions } from "@/store/hooks";
import CachedIcon from "@mui/icons-material/Cached";

const PublicRoomWrapper = styled(Container)({
  gap: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "@media (min-width: 481px) and (max-width: 767px)": {
    width: "300px",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    width: "300px",
  },
});

const TableContainer = styled(Box)({
  "@media (min-width: 481px) and (max-width: 767px)": {
    width: "300px",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    width: "300px",
  },
});

const MainTableWrapper = styled(Container)({
  height: "300px",
  overflow: "hidden",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    width: "9px",
    backgroundColor: "rgba(0, 0, 0, .2)",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
    backgroundColor: "#555",
  },
});

const ActionBarContainer = styled(Box)({
  display: "flex",
  padding: "0px 18px",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "20px 0px",
  "@media (min-width: 481px) and (max-width: 767px)": {
    gap: "12px",
    flexDirection: "column",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    gap: "12px",
    flexDirection: "column",
  },
});

export default function Public() {
  const { data: rooms, isFetching } = useGetRoomsQuery();
  const [roomslist, setRoomsList] = useState<IRooms[]>([]);

  const [columnFilters, setColumnFilters] =
    React.useState<MRT_ColumnFiltersState>([]);
  const [gameModeFilters, setGameModeFilters] = useState<string[]>([]);
  const [gameTypeFilters, setGameTypeFilters] = useState<string[]>([]);

  const { roomsInvalidateTags } = useActions();

  const gameMode: IDropdownType[] = [
    {
      text: "Classic",
      value: "Classic",
    },
    {
      text: "Speed",
      value: "Speed",
    },
  ];

  const gameType: IDropdownType[] = [
    {
      text: "Casual",
      value: "Casual",
    },
    {
      text: "Ranked",
      value: "Ranked",
    },
    {
      text: "Wager",
      value: "Wager",
    },
  ];

  // Api call
  useEffect(() => {
    if (rooms && rooms?.length > 0) {
      setRoomsList(rooms);
    }
  }, [rooms]);

  return (
    <PublicRoomWrapper>
      {isFetching ? (
        <TailSpin color="#00BFFF" height="30px" />
      ) : (
        <TableContainer>
          <ActionBarContainer>
            <FilterDropdown
              placeholder="Filter: Game Mode"
              dropdownItems={gameMode || []}
              defaultSelected={gameModeFilters}
              onSubmitHandler={(selectedItem) => {
                setGameModeFilters(selectedItem);
                if (selectedItem.length) {
                  setColumnFilters((filters) => [
                    ...filters.filter(
                      (item) => item.id !== GameFilterType.GameMode
                    ),
                    { id: GameFilterType.GameMode, value: selectedItem },
                  ]);
                } else {
                  setColumnFilters((filters) =>
                    filters.filter(
                      (item) => item.id !== GameFilterType.GameMode
                    )
                  );
                }
              }}
            />
            <FilterDropdown
              placeholder="Filter: Game Type"
              dropdownItems={gameType || []}
              defaultSelected={gameTypeFilters}
              onSubmitHandler={(selectedItem) => {
                setGameTypeFilters(selectedItem);
                if (selectedItem.length) {
                  setColumnFilters((filters) => [
                    ...filters.filter(
                      (item) => item.id !== GameFilterType.GameType
                    ),
                    { id: GameFilterType.GameType, value: selectedItem },
                  ]);
                } else {
                  setColumnFilters((filters) =>
                    filters.filter(
                      (item) => item.id !== GameFilterType.GameType
                    )
                  );
                }
              }}
            />
            <AppButton
              variant="contained"
              onClick={() => roomsInvalidateTags(["rooms"])}
              startIcon={<CachedIcon />}
            >
              Refresh
            </AppButton>
          </ActionBarContainer>
          <MainTableWrapper>
            <CustomTableContainer
              rows={roomslist}
              columnFilters={columnFilters}
            />
          </MainTableWrapper>
        </TableContainer>
      )}
    </PublicRoomWrapper>
  );
}
