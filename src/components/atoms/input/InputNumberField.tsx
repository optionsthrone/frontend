import React, { useRef } from "react";
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  TextFieldProps,
  styled,
} from "@mui/material";
import Image from "next/image";
import { UseControllerProps } from "react-hook-form";
import redArrow from "../../../../public/images/trades/Red arrow.webp";
import greenArrow from "../../../../public/images/trades/Green arrow.webp";

type IRangeProps = {
  min: number;
  max: number;
  step: number;
};

type IProps = {
  min?: number;
  max?: number | null;
  step?: number | null;
  initialValue?: number;
  rangeBtn?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  rangeBtnHandler?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    range: IRangeProps,
    eventType: string,
    evenyName: string
  ) => void;
  rangeBtnStatus?: string[];
  readOnly?: boolean;
  currency?: boolean;
  arrows?: boolean;
  setShowFocus?: React.Dispatch<React.SetStateAction<boolean>>;

  setValidate?: React.Dispatch<React.SetStateAction<boolean>>;
} & TextFieldProps &
  UseControllerProps;

const StyledContentWrapper = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  margin: "5px 10px",
  flexDirection: "column",
  width: "100%",
  //   "& div": {
  //     flex: 1,
  //   },
});

const StyledOutlinedInput = styled(OutlinedInput)({
  height: "42%",
  width: "100%",
  paddingLeft: "7px",
  paddingRight: "7px",
  fontSize: "0.68rem",
  backgroundColor: "#fff",
  borderRadius: "5px",
  "& .MuiOutlinedInput-input": {
    padding: "0px",
  },
  "& .MuiInputAdornment-root": {
    marginRight: 0,
  },
});

const StyledRedButton = styled(Button)({
  width: "10px",
  minWidth: "3px",
  padding: "0.09rem",

  "&.Mui-disabled": {
    opacity: "0.4",
    //   color: "rgba(255, 255, 255, 1)",
    //   border: "1px solid rgba(255, 255, 255, 1)",
  },
});
const StyledGreenButton = styled(Button)({
  width: "10px",
  minWidth: "3px",
  padding: "0.09rem",
  "&.Mui-disabled": {
    opacity: "0.4",
    //   color: "rgba(255, 255, 255, 1)",
    //   border: "1px solid rgba(255, 255, 255, 1)",
  },
});

const handleRangeEvent = (
  value: number,
  range: IRangeProps,
  type: string,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rangeBtnHandler: (...args: any) => void
) => {
  const localFieldName = name.split("[");
  const fieldType = localFieldName[0];
  const fieldName = localFieldName[1].split("]")[0];

  const { min, max, step } = range;

  if ((min === 0 || min) && max && step) {
    rangeBtnHandler(
      value,
      {
        min,
        max,
        step,
      },
      type,
      `${fieldType}.${fieldName}`
    );
  }
};

const InputNumberField = ({
  name,
  label,
  value,
  onChange,
  min,
  max,
  step,
  rangeBtnStatus,
  rangeBtnHandler = () => {},
  readOnly,
  currency,
  arrows,
  initialValue,

  setShowFocus,
  setValidate,
  ...extraProps
}: IProps) => {
  const controllerRef = useRef<HTMLInputElement>(null);
  const fallbackValue = 0;
  const formatNumber = (value: string | number): string => {
    return new Intl.NumberFormat().format(Number(value));
  };

  const parseNumber = (value: string): number => {
    const parsedNumber = Number(value.replace(/,/g, ""));

    // if (!max || !min) return parsedNumber;
    // // if(parsedNumber > max) {
    // //   return max;
    // // }
    // //  if (parsedNumber < min) {
    // //    return min;
    // //  }
    // if (name === "primaryLeg[strike]" || name === "coveringLeg[strike]") {
    //   fallbackValue = 10;
    //   // make sure strikes are in multiples of 10
    //   const parsedStrike = Math.round(parsedNumber / 10) * 10;
    //   if (parsedStrike < min) {
    //     return min;
    //   }
    //   if (parsedStrike > max) {
    //     return max;
    //   }
    //   return parsedStrike || fallbackValue;
    // }
    // if (name === "primaryLeg[expiry]" || name === "coveringLeg[expiry]") {
    //   if (parsedNumber < min) {
    //     return min;
    //   }
    //   if (parsedNumber > max) {
    //     return max;
    //   }
    // }
    // if (parsedNumber < min) {
    //   return min;
    // }
    // if (parsedNumber > max) {
    //   return max;
    // }
    return parsedNumber || fallbackValue;
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!setValidate) return;
    const input = event.target;
    const parsedNumber = Number(input.value.replace(/,/g, ""));
    if (!max || !min) return parsedNumber;
    if (parsedNumber < min || parsedNumber > max) {
      input.setCustomValidity("Choose values between " + min + " and " + max);

      setValidate(false);
    } else if (
      (name === "primaryLeg[strike]" || name === "coveringLeg[strike]") &&
      parsedNumber % 10 !== 0
    ) {
      // make sure strikes are in multiples of 10

      input.setCustomValidity("strike must be multiples of 10");
      setValidate(false);
    } else {
      input.setCustomValidity(""); // Clear the custom message if the input is valid
      setValidate(true);
    }
    input.reportValidity(); // Optionally, to show the message immediately
  };
  // primaryLeg[quantity]
  // primaryLeg[strike]
  // primaryLeg[expiry]

  return (
    <StyledContentWrapper>
      <Box>{label}</Box>
      <StyledOutlinedInput
        style={{
          width: (currency && "9.4rem") || "100%",
          height: (currency && "1rem") || "42%",
        }}
        ref={controllerRef}
        startAdornment={
          <>
            {/* {currency && <InputAdornment position="start">$</InputAdornment>} */}
            {arrows && (
              <InputAdornment position="start">
                <StyledGreenButton
                  disabled={
                    extraProps?.disabled ||
                    rangeBtnStatus?.includes(name + "-plus")
                  }
                  onClick={() => {
                    if (setShowFocus) {
                      setShowFocus(false);
                    }
                    if ((min === 0 || min) && max && step) {
                      handleRangeEvent(
                        Number(value) ||
                          (typeof value === "number" && value) ||
                          initialValue ||
                          0,
                        {
                          min,
                          max,
                          step,
                        },
                        "plus",
                        name,
                        rangeBtnHandler
                      );
                    }
                  }}
                >
                  <Image src={greenArrow} alt="short" height={20} width={20} />
                </StyledGreenButton>
              </InputAdornment>
            )}
          </>
        }
        endAdornment={
          arrows && (
            <InputAdornment position="start">
              <StyledRedButton
                disabled={
                  extraProps?.disabled ||
                  rangeBtnStatus?.includes(name + "-minus")
                }
                onClick={() => {
                  if (setShowFocus) {
                    setShowFocus(false);
                  }
                  if ((min === 0 || min) && max && step) {
                    handleRangeEvent(
                      Number(value) ||
                        (typeof value === "number" && value) ||
                        initialValue ||
                        0,
                      {
                        min,
                        max,
                        step,
                      },
                      "minus",
                      name,
                      rangeBtnHandler
                    );
                  }
                }}
              >
                <Image src={redArrow} alt="short" height={20} width={20} />
              </StyledRedButton>
            </InputAdornment>
          )
        }
        type="text"
        inputProps={{
          min,
          max,
          step,
          inputMode: "numeric",
          // pattern: "[0-9]*",
        }}
        name={name}
        value={
          name === "cashEffect"
            ? "-" + formatNumber(Number(value))
            : value
            ? formatNumber(Number(value))
            : initialValue
            ? formatNumber(Number(initialValue))
            : 0
        }
        // defaultValue={initialValue}
        // value={null}
        size="small"
        onChange={(e) => {
          e.target.setCustomValidity(""); // Clear the custom message if the input is valid
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange(parseNumber(e.target.value) as unknown as any);
        }}
        // onChange={onChange}
        onFocus={() => {
          if (setShowFocus) {
            setShowFocus(true);
          }
          if (!setValidate) return;
          setValidate(false);
        }}
        onBlur={handleBlur}
        readOnly={readOnly}
        disabled={extraProps?.disabled}
        // autoFocus
      />
      {/* {rangeBtn && rangeBtnHandler && (
        <>
          <StyledButton
            variant="outlined"
            color="primary"
            disabled={
              extraProps?.disabled || rangeBtnStatus?.includes(name + "-minus")
            }
            onClick={() => {
              if ((min === 0 || min) && max && step) {
                handleRangeEvent(
                  Number(value) || 0,
                  {
                    min,
                    max,
                    step,
                  },
                  "minus",
                  name,
                  rangeBtnHandler
                );
              }
            }}
          >
            -
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="primary"
            disabled={
              extraProps?.disabled || rangeBtnStatus?.includes(name + "-plus")
            }
            onClick={() => {
              if ((min === 0 || min) && max && step) {
                handleRangeEvent(
                  Number(value) || 0,
                  {
                    min,
                    max,
                    step,
                  },
                  "plus",
                  name,
                  rangeBtnHandler
                );
              }
            }}
          >
            +
          </StyledButton>
        </>
      )} */}
    </StyledContentWrapper>
  );
};

export default InputNumberField;
