import {
  BaseSelectProps,
  // FormControl,
  // FormHelperText,
  // MenuItem,
  // Select,
} from "@mui/material";
import {
  Controller,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { DropdownTypes } from "@/types/interfaces/auth/auth";
import InputDropdownField from "../input/InputDropdownField";

type IProps = {
  dropDownItem: Array<DropdownTypes | null>;
} & BaseSelectProps &
  UseControllerProps;

const FormLevelDropdown = ({
  name,
  label,
  placeholder,
  dropDownItem,
  ...extraProps
}: IProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      {...extraProps}
      render={({ field: { onChange, onBlur, value } }) => (
        <InputDropdownField
          label={label}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          dropDownItem={dropDownItem}
          disabled={extraProps.disabled}
        />
      )}
    />
  );
};

export default FormLevelDropdown;
