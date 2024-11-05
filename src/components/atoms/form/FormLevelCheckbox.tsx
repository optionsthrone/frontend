import {
  // Checkbox,
  CheckboxProps,
  // FormControl,
  // FormControlLabel,
  // TextFieldProps,
} from "@mui/material";
import {
  Controller,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import InputCheckboxField from "../input/InputCheckboxField";

type IProps = {
  label?: string;
} & CheckboxProps &
  UseControllerProps;

const FormLevelCheckbox = ({ name, label, ...extraProps }: IProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      {...extraProps}
      render={({ field: { onChange, value } }) => (
        <InputCheckboxField
          name={name}
          label={label}
          onChange={onChange}
          value={value}
          disabled={extraProps?.disabled}
          readOnly={extraProps?.readOnly}
        />
      )}
    />
  );
};

export default FormLevelCheckbox;
