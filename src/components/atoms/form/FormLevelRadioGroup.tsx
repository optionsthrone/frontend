import { RadioGroupProps } from "@mui/material";
import {
  Controller,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import InputRadioGroupField from "@/components/atoms/input/InputRadioGroupField";
import InputRadioGroupImageField from "@/components/atoms/input/InputRadioGroupImageField";

type IProps = {
  radioGroups: Array<{ label: string; value: string }>;
  isImageGroup?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSelected?: (...args: any) => void;
} & RadioGroupProps &
  UseControllerProps;

const FormLevelRadioGroup = ({
  name,
  radioGroups,
  isImageGroup,
  handleSelected,
  ...extraProps
}: IProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) =>
        isImageGroup ? (
          <InputRadioGroupImageField
            name={name}
            onChange={onChange}
            value={value}
            radioGroups={radioGroups}
            disabled={extraProps.disabled}
            handleSelected={handleSelected}
          />
        ) : (
          <InputRadioGroupField
            name={name}
            onChange={onChange}
            value={value}
            radioGroups={radioGroups}
            disabled={extraProps.disabled}
          />
        )
      }
    />
  );
};

export default FormLevelRadioGroup;
