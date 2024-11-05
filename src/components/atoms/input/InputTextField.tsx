import { UseControllerProps } from "react-hook-form";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import TuneIcon from "@mui/icons-material/Tune";

import {
  Box,
  FormHelperText,
  TextField,
  TextFieldProps,
  styled,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";

const StyledContentWrapper = styled(Box)<{ formstyle: string }>(
  ({ formstyle }) => ({
    display: formstyle === "flex" ? formstyle : "inline-block",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 0px",
  })
);

const StyledTextFieldLabel = styled("div")<{
  error: number;
}>(({ error }) => ({
  flexBasis: "150px",
  flexGrow: 1,
  color: error ? red[500] : grey[50],
}));

const StyledTextField = styled(TextField)({
  flexBasis: "150px",
  flexGrow: 1,
  "& .MuiOutlinedInput-input": {
    backgroundColor: "#fff",
    borderRadius: "5px",
    border: "none",
    padding: "4px 5px 5px",
  },
  "& .MuiOutlinedInput-input.Mui-disabled": {
    opacity: "0.8",
  },
});

const StyledErrorMessageText = styled(FormHelperText)({
  color: "#C02195",
});

type IProps = {
  errorMessage?: string;
  formstyle?: string;
} & TextFieldProps &
  Pick<UseControllerProps, "rules">;

const InputTextField = ({
  label,
  value,
  formstyle = "",
  errorMessage = "",
  ...extraProps
}: IProps) => {
  return (
    <StyledContentWrapper formstyle={formstyle}>
      <StyledTextFieldLabel error={errorMessage.length}>
        {label}
      </StyledTextFieldLabel>
      <StyledTextField
        size="small"
        variant="outlined"
        value={value || ""}
        {...extraProps}
      />
      {!!errorMessage && !!errorMessage.length && (
        <StyledErrorMessageText>{errorMessage}</StyledErrorMessageText>
      )}
    </StyledContentWrapper>
  );
};

export default InputTextField;
