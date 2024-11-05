import Modal from "@/components/atoms/Modal";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import AppButton from "@/components/atoms/buttons/AppButton";
import { useActions, useAppSelector } from "@/store/hooks";
import {
  Box,
  FormControlLabel,
  Switch,
  SwitchProps,
  styled,
} from "@mui/material";
import optionsPriceChartJson from "@/playground_assets/options_price_chart.json";
import { useState } from "react";
import { IOptionPrice } from "@/types/interfaces/game/optionPrice";
import { IPositionLeg } from "@/types/interfaces/game/game";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#42bda9",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const StyledTableContainer = styled(Box)({
  width: "70vw",
  margin: "auto",
  color: "hsla(0, 0%, 100%, .8)",
  "& .highlighted": {
    backgroundColor: "rgba(129, 141, 44, 0.8)",
  },
  "& header": {
    display: "flex",
    fontWeight: "700",

    "& .title": {
      width: "18%",
      padding: "10px",
      fontSize: "11px",
      "& h1": {
        fontSize: "30px",
        fontWeight: "700",
      },
      "& div p:first-of-type": {
        color: "#42bda9",
      },
      "& div p:last-child": {
        color: "#c63e7c",
      },
    },
  },
  "& .table-container": {
    display: "flex",
    "& h2": {
      fontSize: "24px",
      fontWeight: 700,
      writingMode: "vertical-rl",
      transform: "rotate(180deg)",
      whiteSpace: "nowrap",

      display: "flex",
      justifyContent: "flex-end",
      flex: "none",
      marginTop: "80px",
      padding: "50px",
    },

    "& .table-body": {
      flex: "1 1 10%",
      marginRight: "24px",
      "& h3": {
        fontSize: "24px",
        fontWeight: 700,
        textAlign: "center",
        marginTop: "-40px",
        marginBottom: "10px",
      },
      "& .table-price": {
        display: "flex",
        flex: "auto",
        justifyContent: "center",
        alignItems: "center",

        "& .option-price": {
          display: "flex",
          flex: "1 1 10%",
          border: "1px solid #fff",
          justifyContent: "center",
          alignItems: "center",
          height: "50px",
        },
      },
      "& .table-expiry": {
        flex: "1 1 10%",
        "& .table-expiry-row": {
          display: "flex",
          justifyContent: "flex-start",

          "& .table-expiry-column": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #fff",
            height: "50px",
          },

          "& .table-expiry-price": {
            display: "flex",
            flex: "1 1 10%",
            justifyContent: "space-around",
          },
        },
      },
    },
    "& .flex-basis-10": {
      flex: "0 0 10%",
    },
  },
  "@media (max-width:640px)": {
    width: "100%",
  },
});

type IProps = {
  legType: string;
  legState: IPositionLeg;
  corporation: string;
  optionPriceHandler: (type: string, strike: number, expiry: number) => void;
};

const OptionPriceModal = ({
  legType,
  legState,
  corporation,
  optionPriceHandler,
}: IProps) => {
  const { isOptionModalOpen } = useAppSelector((state) => state.gameModal);
  const { corporations } = useAppSelector((state) => state.game.data);
  const { closeOptionModal, toggleErrorSnackbar } = useActions();
  const [currentOrStrikePriceSelected, setCurrentOrStrikePriceSelected] =
    useState(corporations[corporation]?.price ?? 0);
  const [showStrikesAsHeader, setShowStrikesAsHeader] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredCol, setHoveredCol] = useState(0);

  const handleClose = () => {
    closeOptionModal();
  };

  const handleButtonMouseEnter = (rowIndex: number, colIndex: number) => {
    setHoveredRow(rowIndex);
    setHoveredCol(colIndex);
  };

  const optionsPriceChart: IOptionPrice = optionsPriceChartJson;
  const strikePrices = Object.keys(optionsPriceChart);
  const currentPrices = Object.keys(optionsPriceChart[strikePrices[0]]);
  const expiries = Object.keys(
    optionsPriceChart[strikePrices[0]][currentPrices[0]]
  );

  if (legState && legState?.expiry && legType === "coveringLeg") {
    expiries.splice(0, legState?.expiry);
  }

  return (
    <Modal
      open={isOptionModalOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <ModalBody
        sx={{
          maxWidth: "100%",
        }}
      >
        <ModalTitle onClose={handleClose}></ModalTitle>
        <StyledTableContainer>
          <header>
            <Box className="title flex-none w-30">
              <h1 className="text-center">Options Price Chart</h1>
              <Box className="flex">
                <p className="text-center">Call Price Per Contract</p>
                <p className="text-center">Put Price Per Contract</p>
              </Box>
            </Box>
            <Box className="flex-1 pl-2">
              <Box className="flex flex-row justify-between pl-2 pr-5">
                <Box className="flex justify-center items-center">
                  <Box className="pr-2">
                    {showStrikesAsHeader
                      ? "Show Current Price"
                      : "Show Strike Price"}
                  </Box>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        sx={{ m: 1 }}
                        defaultChecked
                        onChange={(e) => {
                          if (
                            !corporations[corporation] ||
                            !corporations[corporation].price
                          ) {
                            toggleErrorSnackbar({
                              message: "Please select a corporation",
                            });
                            return;
                          }
                          setCurrentOrStrikePriceSelected(
                            e.target.checked
                              ? corporations[corporation].price
                              : 50
                          );
                          setShowStrikesAsHeader(e.target.checked);
                        }}
                      />
                    }
                    label=""
                  />
                </Box>
                <Box></Box>
              </Box>
              <Box className="flex flex-row justify-between pl-2 pr-5">
                <Box className="flex justify-start items-center">
                  <h2>{corporation} Current Price : </h2>
                  <Box>${corporations[corporation]?.price}</Box>
                </Box>
                <Box className="text-center font-bold">
                  <h3>
                    {showStrikesAsHeader ? "Current Price" : "Strike Price"}
                  </h3>
                  <Box className="flex justify-center items-center">
                    <AppButton
                      variant="outlined"
                      color="primary"
                      className="font-bold text-2xl"
                      onClick={() => {
                        if (
                          currentOrStrikePriceSelected >
                          (showStrikesAsHeader ? 0 : 10)
                        ) {
                          setCurrentOrStrikePriceSelected(
                            currentOrStrikePriceSelected - 10
                          );
                        }
                      }}
                    >
                      &#x2D;
                    </AppButton>
                    <div className="px-2">{currentOrStrikePriceSelected}</div>
                    <AppButton
                      variant="outlined"
                      color="primary"
                      className="font-bold text-2xl"
                      onClick={() => {
                        if (
                          currentOrStrikePriceSelected <
                          (showStrikesAsHeader ? 100 : 90)
                        ) {
                          setCurrentOrStrikePriceSelected(
                            currentOrStrikePriceSelected + 10
                          );
                        }
                      }}
                    >
                      &#x2B;
                    </AppButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </header>
          <Box className="table-container">
            <h2>Number Of Turns Till Expiry</h2>
            <Box className="table-body">
              <h3>{showStrikesAsHeader ? "Strike Price" : "Current Price"}</h3>
              <Box className="table-price">
                <div className="flex-basis-10"></div>
                {(showStrikesAsHeader ? strikePrices : currentPrices).map(
                  (strikeOrCurrentPrice, colIndex) => (
                    <div
                      key={strikeOrCurrentPrice}
                      className={`option-price ${
                        hoveredCol === colIndex ? "highlighted" : ""
                      }`}
                    >
                      {strikeOrCurrentPrice}
                    </div>
                  )
                )}
              </Box>
              <Box className="table-expiry">
                {expiries.map((expiry, rowIndex) => {
                  return (
                    <Box
                      key={expiry}
                      className={`table-expiry-row  ${
                        hoveredRow === rowIndex ? "highlighted" : ""
                      }`}
                    >
                      <Box
                        className={`table-expiry-column flex-basis-10  ${
                          hoveredRow === rowIndex ? "highlighted" : ""
                        }`}
                      >
                        {expiry}
                      </Box>
                      {(showStrikesAsHeader ? strikePrices : currentPrices).map(
                        (strikeOrCurrentPrice, colIndex) => {
                          const strikeOrCurrentPriceVal =
                            strikeOrCurrentPrice as keyof typeof optionsPriceChart;
                          return (
                            <Box
                              key={strikeOrCurrentPrice}
                              className="table-expiry-price"
                              onMouseEnter={() =>
                                handleButtonMouseEnter(rowIndex, colIndex)
                              }
                            >
                              <Box
                                className="flex-1 flex justify-center items-center text-xs font-bold"
                                style={{
                                  color:
                                    legType === "coveringLeg" &&
                                    legState.type === "put"
                                      ? "#13192F"
                                      : "#42bda9",
                                  backgroundColor:
                                    parseInt(expiry) % 2 === 0
                                      ? "#13192F"
                                      : "#0F1427",
                                }}
                                onClick={(e) => {
                                  if (
                                    legType === "coveringLeg" &&
                                    legState.type === "put"
                                  ) {
                                    e.preventDefault();
                                  } else {
                                    optionPriceHandler(
                                      "call",
                                      showStrikesAsHeader
                                        ? parseInt(strikeOrCurrentPrice)
                                        : currentOrStrikePriceSelected,
                                      parseInt(expiry)
                                    );
                                    closeOptionModal();
                                  }
                                }}
                              >
                                {legType === "coveringLeg" &&
                                legState.type === "put" ? (
                                  <></>
                                ) : showStrikesAsHeader ? (
                                  optionsPriceChart[strikeOrCurrentPriceVal][
                                    currentOrStrikePriceSelected?.toString()
                                  ][expiry]?.call
                                ) : (
                                  optionsPriceChart[
                                    currentOrStrikePriceSelected?.toString()
                                  ][strikeOrCurrentPrice][expiry]?.call
                                )}
                                {/* {showStrikesAsHeader
                                                                    ? optionsPriceChart[strikeOrCurrentPriceVal][
                                                                        currentOrStrikePriceSelected.toString()
                                                                    ][expiry].call
                                                                    : optionsPriceChart[
                                                                        currentOrStrikePriceSelected.toString()
                                                                    ][strikeOrCurrentPrice][expiry].call} */}
                              </Box>
                              <Box
                                className="flex-1 flex justify-center items-center text-xs font-bold"
                                style={{
                                  color:
                                    legType === "coveringLeg" &&
                                    legState.type === "call"
                                      ? "#112E50"
                                      : "#c63e7c",
                                  backgroundColor:
                                    parseInt(expiry) % 2 === 0
                                      ? "#112E50"
                                      : "#0C2947",
                                }}
                                onClick={(e) => {
                                  if (
                                    legType === "coveringLeg" &&
                                    legState.type === "call"
                                  ) {
                                    e.preventDefault();
                                  } else {
                                    optionPriceHandler(
                                      "put",
                                      showStrikesAsHeader
                                        ? parseInt(strikeOrCurrentPrice)
                                        : currentOrStrikePriceSelected,
                                      parseInt(expiry)
                                    );
                                    closeOptionModal();
                                  }
                                }}
                              >
                                {legType === "coveringLeg" &&
                                legState.type === "call" ? (
                                  <></>
                                ) : showStrikesAsHeader ? (
                                  optionsPriceChart[strikeOrCurrentPrice][
                                    currentOrStrikePriceSelected.toString()
                                  ][expiry].put
                                ) : (
                                  optionsPriceChart[
                                    currentOrStrikePriceSelected.toString()
                                  ][strikeOrCurrentPrice][expiry].put
                                )}
                                {/* {showStrikesAsHeader
                                                                    ? optionsPriceChart[strikeOrCurrentPrice][
                                                                        currentOrStrikePriceSelected.toString()
                                                                    ][expiry].put
                                                                    : optionsPriceChart[
                                                                        currentOrStrikePriceSelected.toString()
                                                                    ][strikeOrCurrentPrice][expiry].put} */}
                              </Box>
                            </Box>
                          );
                        }
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </StyledTableContainer>
      </ModalBody>
    </Modal>
  );
};

export default OptionPriceModal;
