"use client";
import * as React from "react";
import { useAppSelector } from "@/store/hooks";
import { IPositionLeg } from "@/types/interfaces/game/game";
import { UseControllerProps, UseFormSetValue } from "react-hook-form";
import FormLevelInputNumber from "@/components/atoms/form/FormLevelInputNumber";
import { Box, styled } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Shares from "../trades/shares";
import { ITradeForm } from "@/types/game/trade";
import Options from "../trades/options";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  tabValue: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, tabValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tabValue === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

type IProps = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tradeState?: any;
  legState: IPositionLeg | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRangeBtnClick: (...args: any[]) => void;
  onOptionPriceChartClick: (type: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hookWatch?: any;
  corporation: string;
  setValue: UseFormSetValue<ITradeForm>;
  name: "primaryLeg" | "coveringLeg";
  setValidate: React.Dispatch<React.SetStateAction<boolean>>;
} & UseControllerProps;

const StyledLeg = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  "& h3": {
    fontSize: "18px1",
    fontWeight: 700,
    padding: "10px 0px",
  },
});

const TradeLegForm = ({
  title,
  name,
  tradeState,
  legState,
  hookWatch,
  onRangeBtnClick,
  onOptionPriceChartClick,
  corporation,
  setValue,
  setValidate,
}: IProps) => {
  // rerender the inputfield by changing the key
  const [showFocus, setShowFocus] = React.useState(false);

  // chnage active tabs
  const [tabValue, setTabValue] = React.useState(
    tradeState[name].type === "put" || tradeState[name].type === "call" ? 1 : 0
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const { currentTurn } = useAppSelector((state) => state.game.data);
  const { adjust } = useAppSelector((state) => state.gamePlay);
  const tradeType = adjust?.tradeType ?? "New Trade";

  const disabledFields: string[] = [];
  const disabledIcons: string[] = [];
  const fieldWatch = hookWatch ? hookWatch() : null;

  if (fieldWatch) {
    if (
      fieldWatch?.primaryLeg?.type === "shares" &&
      fieldWatch?.primaryLeg?.direction === "short"
    ) {
      disabledFields.push(
        "primaryLeg[margin]",
        "primaryLeg[srtike]",
        "primaryLeg[expiry]"
      );
    } else if (
      fieldWatch?.primaryLeg?.type === "shares" &&
      fieldWatch?.primaryLeg?.direction === "long"
    ) {
      disabledFields.push("primaryLeg[srtike]", "primaryLeg[expiry]");
    }

    if (
      fieldWatch?.primaryLeg?.type === "call" ||
      fieldWatch?.primaryLeg?.type === "put"
    ) {
      disabledFields.push("primaryLeg[margin]");
    }

    if (
      fieldWatch?.primaryLeg?.expiry &&
      fieldWatch?.coveringLeg &&
      fieldWatch?.coveringLeg?.expiry
    ) {
      if (fieldWatch?.primaryLeg?.expiry >= fieldWatch?.coveringLeg?.expiry) {
        disabledIcons.push("coveringLeg[expiry]-minus");
      } else {
        const index = disabledIcons.indexOf("coveringLeg[expiry]-minus");
        if (index > -1) {
          disabledIcons.splice(index, 1);
        }
      }
    }
  }

  React.useEffect(() => {
    if (!tradeState[name].type && !tradeState["coveringLeg"]) {
      setValue(`${name}.type`, "shares");
    }
  }, []);

  React.useEffect(() => {
    setTabValue(
      tradeState[name].type === "put" || tradeState[name].type === "call"
        ? 1
        : 0
    );
  }, [tradeState["coveringLeg"]]);

  return (
    <StyledLeg>
      <h3>{title}</h3>{" "}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", justifyContent: "center" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                display: "none",
              },
            }}
            sx={{
              "& div": {
                "& div": {
                  justifyContent: "center",
                },
              },
            }}
          >
            <Tab
              sx={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(198, 62, 124, 0.5) 0%, rgba(137, 51, 90, 0.5) 100%)",

                color: "white",
                textTransform: "capitalize",
                borderRadius: "0.5rem 0rem 0rem 0.5rem",
                padding: "0.4rem 0rem",
                height: "fit-content",
                minHeight: "0rem",
                transform: "translateX(0.1rem) translateY(0.1rem)",

                "&.Mui-selected": {
                  borderRadius: "0.5rem",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #C63E7C 0%, #89335A 100%)",
                  color: "white",
                  border: "1.5px solid #B8994A",
                  transform: "none",
                },
              }}
              value={0}
              label="Shares"
              onClick={() => {
                setValue(`${name}.type`, "shares");
              }}
              disabled={
                ((tradeState[name].type === "put" ||
                  tradeState[name].type === "call") &&
                  tradeType !== "New Trade") ||
                (tradeState["coveringLeg"]?.type &&
                  tradeState["coveringLeg"]?.type !== "shares")
              }
            />

            <Tab
              sx={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(66, 189, 169, 0.5) 0%, rgba(45, 140, 125, 0.5) 100%)",
                color: "white",
                borderRadius: "0 0.5rem 0.5rem 0",
                padding: "0.4rem 0rem",
                height: "fit-content",
                textTransform: "capitalize",
                minHeight: "0rem",
                transform: "translateX(-0.1rem) translateY(0.1rem)",
                "&.Mui-selected": {
                  transform: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #42BDA9 0%, #2D8C7D 100%)",
                  border: "1.5px solid #B8994A",
                },
              }}
              value={1}
              label="Options"
              onClick={() => {
                if (tradeType !== "New Trade") return;
                if (name === "coveringLeg") return;
                setValue(`${name}.type`, "");
              }}
              disabled={
                currentTurn === 0 ||
                (tradeState[name].type === "shares" &&
                  tradeType !== "New Trade") ||
                (tradeState["coveringLeg"]?.type &&
                  tradeState["coveringLeg"]?.type === "shares")
              }
            />
          </Tabs>
        </Box>
        <CustomTabPanel tabValue={tabValue} index={0}>
          <Shares
            formKey={!showFocus ? Date.now() : `${name}[quantity]`}
            name={name}
            max={
              adjust && tradeType === "close"
                ? adjust.position.primaryLeg.quantity
                : name === "coveringLeg" && tradeState["coveringLeg"]?.quantity
                ? tradeState["coveringLeg"]?.quantity
                : 1000000
            }
            disabledIcons={disabledIcons}
            onRangeBtnClick={onRangeBtnClick}
            corporation={corporation}
            setValue={setValue}
            tradeState={tradeState}
            setShowFocus={setShowFocus}
            setValidate={setValidate}
          />
        </CustomTabPanel>
        <CustomTabPanel tabValue={tabValue} index={1}>
          <Options
            formKey={!showFocus ? Date.now() : `${name}[quantity]`}
            name={name}
            min={
              name === "coveringLeg" && tradeState?.primaryLeg?.expiry
                ? tradeState?.primaryLeg?.expiry
                : currentTurn
            }
            max={
              adjust && tradeType === "close"
                ? adjust.position.primaryLeg.quantity
                : name === "coveringLeg" && tradeState["coveringLeg"]?.quantity
                ? tradeState["coveringLeg"]?.quantity
                : 10000
            }
            disabledIcons={disabledIcons}
            onRangeBtnClick={onRangeBtnClick}
            corporation={corporation}
            setValue={setValue}
            setShowFocus={setShowFocus}
            tradeState={tradeState}
            disabledFields={disabledFields}
            onOptionPriceChartClick={onOptionPriceChartClick}
            setValidate={setValidate}
            showFocus={showFocus}
          />
        </CustomTabPanel>
      </Box>
      {/* <FormLevelDropdown
        key={legState?.type || `${name}[type]`}
        name={`${name}[type]`}
        label="Type :"
        placeholder="Select Type"
        dropDownItem={[
          { keyName: "Shares", keyValue: "shares" },
          { keyName: "Call", keyValue: "call" },
          { keyName: "Put", keyValue: "put" },
        ]}
        disabled={name === "coveringLeg" || !!adjust.position.primaryLeg.type}
      /> */}
      {/* <FormLevelRadioGroup
        key={legState?.direction || `${name}[direction]`}
        name={`${name}[direction]`}
        radioGroups={[
          { label: "Short", value: "short" },
          { label: "Long", value: "long" },
        ]}
        disabled={
          name === "coveringLeg" || !!adjust.position.primaryLeg.direction
        }
      />
      <FormLevelCheckbox
        key={String(legState?.margin) || `${name}[margin]`}
        name={`${name}[margin]`}
        label="Margin"
        disabled={
          disabledFields.includes(`${name}[margin]`) ||
          (legState?.type === "shares" && legState?.direction === "short")
        }
        checked={
          name === "primaryLeg" &&
          (legState?.type === "call" || legState?.type === "put")
        }
      /> */}
      <Box>
        {/* <FormLevelInputNumber
          key={
            Number(legState?.quantity) * Date.now() -
              Math.floor(Math.random() * (10000 - 10 + 1) + 10) ||
            `${name}[quantity]`
          }
          name={`${name}[quantity]`}
          label="Quantity :"
          step={1}
          min={0}
          max={
            adjust && tradeType === "close"
              ? adjust.position.primaryLeg.quantity
              : 1000
          }
          rangeBtn={name !== "coveringLeg"}
          rangeBtnStatus={disabledIcons}
          rangeBtnHandler={onRangeBtnClick}
          readOnly={name === "coveringLeg"}
          arrows={true}
        /> */}
        {/* <FormLevelInputNumber
          key={legState?.strike || `${name}[strike]`}
          name={`${name}[strike]`}
          label="Strike :"
          step={10}
          min={0}
          max={90}
          rangeBtn
          rangeBtnStatus={disabledIcons}
          rangeBtnHandler={onRangeBtnClick}
          disabled={
            (name === "coveringLeg" && legState?.type === "shares") ||
            disabledFields.includes(`${name}[srtike]`) ||
            (adjust.tradeType !== "New Trade" &&
              !adjust.position.primaryLeg.strike)
          }
          arrows={true}
        /> */}
        {/* <FormLevelInputNumber
          key={
            Number(
              legState?.expiry ||
                (name === "coveringLeg" ? tradeState?.primaryLeg?.expiry : 100)
            ) *
              Date.now() -
              2 || `${name}[expiry]`
          }
          name={`${name}[expiry]`}
          label="Expiry :"
          step={1}
          min={
            name === "coveringLeg" && tradeState?.primaryLeg?.expiry
              ? tradeState?.primaryLeg?.expiry
              : currentTurn
          }
          max={10}
          rangeBtn
          rangeBtnStatus={disabledIcons}
          rangeBtnHandler={onRangeBtnClick}
          disabled={
            (name === "coveringLeg" && legState?.type === "shares") ||
            disabledFields.includes(`${name}[expiry]`) ||
            (adjust.tradeType !== "New Trade" &&
              !adjust.position.primaryLeg.expiry)
          }
        /> */}
        <Box
          sx={{
            display: "flex",
          }}
        >
          <span style={{ width: "-webkit-fill-available" }}>Price :</span>
          <FormLevelInputNumber
            key={legState?.price}
            name={`${name}[price]`}
            // label="Price :"
            currency
            readOnly
            setValidate={setValidate}
          />
          {/* <StyleIconButton
            size="large"
            onClick={() => {
              openOptionPriceModal("option");
              onOptionPriceChartClick(name);
            }}
            disabled={legState?.type === "shares"}
          >
            <AnalyticsIcon fontSize="inherit" />
          </StyleIconButton> */}
        </Box>
      </Box>
    </StyledLeg>
  );
};

export default TradeLegForm;
