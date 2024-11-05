import {
  Controller,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import InputTextField from "@/components/atoms/input/InputTextField";
import { TextFieldProps } from "@mui/material";

type IProps = {
  formstyle?: string;
} & TextFieldProps &
  UseControllerProps;

const FormLevelInput = ({ name, ...extraProps }: IProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      {...extraProps}
      render={({ field: { onChange, value } }) => {
        return (
          <InputTextField
            errorMessage={
              errors?.root
                ? String(errors.root[name]?.message || "")
                : String(errors[name]?.message || "")
            }
            name={name}
            value={value}
            onChange={onChange}
            {...extraProps}
          />
        );
      }}
    />
  );
};

export default FormLevelInput;
