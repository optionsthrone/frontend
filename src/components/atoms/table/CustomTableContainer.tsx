import React, { useEffect } from "react";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
} from "material-react-table";
import { IRooms } from "@/types/interfaces/room/room";
import "./table.css";
import { GameFilterType } from "@/types/interfaces/game/game";
import AppButton from "../buttons/AppButton";
import { usePrivateMutation } from "@/store/api/roomApi";
import { useActions, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

type IProps = {
  rows: IRooms[];
  columnFilters: MRT_ColumnFiltersState;
};

const CustomTableContainer = ({ rows, columnFilters }: IProps) => {
  const router = useRouter();
  const [privateRoomAction, { isLoading }] = usePrivateMutation();
  const { token } = useAppSelector((state) => state.userInfo);
  const { toggleInfoSnackbar, toggleErrorSnackbar, toggleSuccessSnackbar } =
    useActions();

  useEffect(() => {
    if (isLoading) {
      toggleInfoSnackbar({
        message: "Joining, please wait",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const hanldeJoinRoom = (roomCode: string) => {
    privateRoomAction({ roomCode, token })
      .unwrap()
      .then(() => {
        toggleSuccessSnackbar({
          message: "Joined successfully",
        });
        router.push(`room/${roomCode}`);
      })
      .catch((e) => {
        if (e.data) {
          toggleErrorSnackbar({
            message: e.data?.message || " Failed",
          });
        }
      });
  };
  // Table column definitions
  const columns = useMemo<MRT_ColumnDef<IRooms>[]>(
    () => [
      {
        id: GameFilterType.GameMode,
        accessorFn: (row) => row.gameSettings["Game Mode"],
        header: "Game Mode",
        muiTableHeadCellProps: { style: { color: "blue" } },
        enableHiding: false,
        enableSorting: false,
        filterFn: (row, id, filters) => {
          const rowData = row.original as IRooms;
          return filters.includes(rowData.gameSettings["Game Mode"]);
        },
      },
      {
        id: GameFilterType.GameType,
        accessorFn: (row) => row.gameSettings["Game Type"],
        header: "Game Type",
        muiTableHeadCellProps: { style: { color: "blue" } },
        enableHiding: false,
        enableSorting: false,
        filterFn: (row, id, filters) => {
          const rowData = row.original as IRooms;
          return filters.includes(rowData.gameSettings["Game Type"]);
        },
      },
      {
        accessorKey: "hostUserName",
        header: "Host",
        muiTableHeadCellProps: { style: { color: "blue" } },
        enableHiding: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <span>{cell.row.original.hostUserName.toUpperCase()}</span>
        ),
      },
      {
        accessorKey: "playerCount",
        header: "Players ",
        muiTableHeadCellProps: { style: { color: "blue" } },
        enableHiding: false,
        Cell: ({ cell }) => {
          return `${cell.row.original.playerCount} / ${cell.row.original.gameSettings["Max Players"]}`;
        },
      },
    ],
    []
  );

  // Pass table options to useMaterialReactTable
  const table = useMaterialReactTable({
    columns: columns as MRT_ColumnDef<object>[],
    data: rows,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableSortingRemoval: false,
    enablePagination: false,
    enableRowActions: true,
    initialState: {
      showColumnFilters: true,
    },
    state: {
      columnFilters,
    },
    columnFilterDisplayMode: "custom",
    muiTablePaperProps: {
      sx: {
        boxShadow: "none",
      },
    },
    muiTableHeadRowProps: {
      sx: {
        minHeight: "44px",
      },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
        size: 35,
        muiTableBodyCellProps: {
          align: "right",
        },
      },
    },
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => {
      const rowData = row.original as IRooms;
      return (
        <AppButton
          size="small"
          variant="contained"
          onClick={() => hanldeJoinRoom(rowData.roomCode)}
        >
          Join
        </AppButton>
      );
    },
  });
  return <MaterialReactTable table={table} />;
};

export default CustomTableContainer;
