import React from "react";
import Image from "next/image";
import { UseControllerProps } from "react-hook-form";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  styled,
} from "@mui/material";

// import gazeImg from "@/playground_assets/board tokens/Gaze.png";
// import haltImg from "@/playground_assets/board tokens/Halt.png";
// import rejectImg from "@/playground_assets/board tokens/Reject.png";
// import protectImg from "@/playground_assets/board tokens/Protect.png";
// import dividendImg from "@/playground_assets/board tokens/Dividend.png";
// import priceActionImg from "@/playground_assets/board tokens/PriceAction.png";
// import { IAbilitesImage } from "@/types/interfaces/game/game";

// const abilityImages: IAbilitesImage = {
//   Gaze: gazeImg.src,
//   Halt: haltImg.src,
//   Reject: rejectImg.src,
//   Protect: protectImg.src,
//   Dividend: dividendImg.src,
//   "Price Action": priceActionImg.src,
// };

type IProps = {
  radioGroups: Array<{ label: string; value: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSelected?: (...args: any) => void;
} & RadioGroupProps &
  UseControllerProps;

const StyledFormControl = styled(FormControl)({
  display: "flex",
  width: "100%",

  ".MuiFormControlLabel-label.Mui-disabled": {
    color: "#fff !important",
    opacity: 0.5,
  },
});

const StyledRadioGroup = styled(RadioGroup)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});

const StyledRadio = styled(Radio)({
  display: "none",
  color: "#fff",
  "&.Mui-disabled": {
    color: "#fff",
    opacity: 0.5,
  },
});

const StyledBox = styled(Box)({
  marginTop: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const StyledImage = styled(Image)({
  width: "4rem",
  padding: "0.8rem",
  "&:hover": {
    backgroundImage:
      "radial-gradient(circle, rgba(255, 255, 255, 0.5) 25%, rgba(255, 255, 255, 0) 65%)",
  },
  "&.selected": {
    backgroundImage:
      "radial-gradient(circle, rgba(255, 255, 255, 0.5) 25%, rgba(255, 255, 255, 0) 65%)",
  },
});

const InputRadioGroupImageField = ({
  name,
  onChange,
  value = "",
  radioGroups,
  disabled,
  handleSelected,
}: IProps) => {
  const handleChange = (value: string) => {
    if (handleSelected) {
      handleSelected(value);
    }
  };
  return (
    <>
      <StyledFormControl>
        <StyledRadioGroup name={name} value={value} onChange={onChange}>
          {radioGroups.map((radioItem, index) => {
            return (
              <FormControlLabel
                key={index}
                value={radioItem?.value}
                control={
                  <StyledRadio
                    disabled={disabled}
                    onChange={() => handleChange(radioItem?.value)}
                  />
                }
                label={
                  <StyledBox>
                    <h3>{radioItem?.label}</h3>
                    <StyledImage
                      //   src={abilityImages[radioItem?.label]}
                      src={`/images/abilities/${radioItem?.label}.webp`}
                      alt=""
                      width={100}
                      height={100}
                      className={`${
                        value === radioItem?.label ? "selected" : "unselected"
                      }`}
                    />
                  </StyledBox>
                }
              />
            );
          })}
        </StyledRadioGroup>
      </StyledFormControl>
    </>
  );
};

export default InputRadioGroupImageField;
