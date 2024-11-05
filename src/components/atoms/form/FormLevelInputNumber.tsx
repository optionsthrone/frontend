import { TextFieldProps } from "@mui/material";
import React from "react";
import {
  Controller,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import InputNumberField from "@/components/atoms/input/InputNumberField";
import { useAppSelector } from "@/store/hooks";

type IProps = {
  min?: number;
  max?: number | null;
  step?: number | null;
  initialValue?: number;
  rangeBtn?: boolean;
  rangeBtnStatus?: string[];
  currency?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rangeBtnHandler?: (...args: any[]) => void;
  readOnly?: boolean;
  arrows?: boolean;
  setShowFocus?: React.Dispatch<React.SetStateAction<boolean>>;

  setValidate?: React.Dispatch<React.SetStateAction<boolean>>;
} & TextFieldProps &
  UseControllerProps;

const FormLevelInputNumber = ({
  name,
  label,
  initialValue,
  setShowFocus,
  ...extraProps
}: IProps) => {
  const { control } = useFormContext();
  const { adjust } = useAppSelector((state) => state.gamePlay);

  return (
    <Controller
      name={name}
      control={control}
      {...extraProps}
      render={({ field: { onChange, value } }) => {
        let finalValue = value;

        if (adjust.tradeType === "New Trade") {
          finalValue = value * (value < 0 ? -1 : 1);
        }

        if (extraProps?.max) {
          if (value >= extraProps?.max) {
            extraProps?.rangeBtnStatus?.push(name + "-plus");
          } else {
            const index = extraProps?.rangeBtnStatus?.indexOf(name + "-plus");
            if (index && index > -1) {
              extraProps?.rangeBtnStatus?.splice(index, 1);
            }
          }
        }
        if (extraProps?.min) {
          if (value <= extraProps?.min) {
            extraProps?.rangeBtnStatus?.push(name + "-minus");
          } else {
            const index = extraProps?.rangeBtnStatus?.indexOf(name + "-minus");
            if (index && index > -1) {
              extraProps?.rangeBtnStatus?.splice(index, 1);
            }
          }
        }

        return (
          <InputNumberField
            key={name}
            name={name}
            label={label}
            value={finalValue}
            onChange={onChange}
            initialValue={initialValue}
            setShowFocus={setShowFocus}
            {...extraProps}
          />
        );
      }}
    />
  );
};

export default FormLevelInputNumber;
