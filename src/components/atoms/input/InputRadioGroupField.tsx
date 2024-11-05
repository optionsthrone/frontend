import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  styled,
} from "@mui/material";
import { UseControllerProps } from "react-hook-form";

type IProps = {
  radioGroups: Array<{ label: string; value: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
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
  color: "#fff",
  "&.Mui-disabled": {
    color: "#fff",
    opacity: 0.5,
  },
});

const InputRadioGroupField = ({
  name,
  onChange,
  value,
  radioGroups,
  disabled,
}: IProps) => {
  return (
    <StyledFormControl>
      <StyledRadioGroup name={name} value={value} onChange={onChange}>
        {radioGroups.map((radioItem, index) => (
          <FormControlLabel
            key={index}
            value={radioItem?.value}
            control={<StyledRadio disabled={disabled} />}
            label={radioItem?.label}
          />
        ))}
      </StyledRadioGroup>
    </StyledFormControl>
  );
};

export default InputRadioGroupField;
