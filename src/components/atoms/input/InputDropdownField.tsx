import { DropdownTypes } from "@/types/interfaces/auth/auth";
import { BaseSelectProps, Box, MenuItem, Select, styled } from "@mui/material";

type IProps = {
  dropDownItem: Array<DropdownTypes | null>;
} & BaseSelectProps;

const StyledContentWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "5px 0px",
});

const StyledLabel = styled("div")({
  padding: "0px 10px",
});

const StyledSelect = styled(Select)({
  flex: 1,
  backgroundColor: "#fff",
  "& .MuiSelect-select": {
    padding: "4px 12px 4px",
  },
});

const InputDropdownField = ({
  label,
  onBlur,
  onChange,
  value,
  placeholder = "Please select",
  dropDownItem,
  disabled,
}: IProps) => {
  return (
    <StyledContentWrapper>
      <StyledLabel>{label}</StyledLabel>
      <StyledSelect
        displayEmpty
        onBlur={onBlur}
        onChange={onChange}
        value={value || ""}
        defaultValue={value || ""}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderValue={(selected: any) => {
          if (selected?.length === 0) {
            return <>{placeholder}</>;
          }
          return <>{selected}</>;
        }}
        size="small"
        MenuProps={{
          PaperProps: {
            sx: {
              "& ul": {
                "@media (max-width:640px)": {
                  writingMode: "vertical-rl",
                  transform: " rotate(-180deg)",
                },
              },
            },
          },
        }}
        disabled={disabled}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {dropDownItem &&
          dropDownItem.length > 0 &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dropDownItem.map((el: any) => (
            <MenuItem key={el?.keyValue} value={el?.keyValue}>
              {el?.keyName}
            </MenuItem>
          ))}
      </StyledSelect>
    </StyledContentWrapper>
  );
};

export default InputDropdownField;

// import { BaseSelectProps, Box, MenuItem, Select, SelectProps, styled } from '@mui/material'
// import { grey, red } from '@mui/material/colors';
// import { UseControllerProps } from 'react-hook-form';
// import { DropdownTypes, IRules } from "@/types/interfaces/auth/auth";

// const StyledContentWrapper = styled(Box)({
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "5px 0px"
// });

// const StyledSelectLabel = styled("div")<{
//     error: number
// }>(({ error }) => ({
//     flexBasis: "150px",
//     color: error ? red[500] : grey[50],
//     padding: "0px 20px",
// }));

// const StyledSelect = styled(Select)({
//     flexBasis: "200px",
//     '& .MuiOutlinedInput-input': {
//         // background: "#fff",
//         padding: '4px 5px 5px'
//     },
//     '& .MuiSelect-nativeInput': {
//         color: "black",
//         opacity: 1,
//         border: "none",
//         padding: "7px",
//         borderRadius: "15px"
//     },
//     '& .Mui-disabled': {
//         opacity: 0
//     }
// });

// type IProps = {
//     errorMessage?: string,
//     dropDownItem: Array<DropdownTypes | null>,
//     handleChange: (...event: any[]) => void,
// } & BaseSelectProps & Pick<UseControllerProps, "rules">;

// const InputDropdownField = ({
//     label,
//     errorMessage = "",
//     dropDownItem,
//     defaultValue,
//     handleChange,
//     ...extraProps
// }: IProps) => {
//     return (
//         <StyledContentWrapper>
//             <StyledSelectLabel error={errorMessage.length}>
//                 {label}
//             </StyledSelectLabel>
//             <StyledSelect
//                 fullWidth
//                 defaultValue={defaultValue}
//                 onChange={handleChange}
//                 {...extraProps}
//             >
//                 {dropDownItem &&
//                     dropDownItem.length > 0 &&
//                     dropDownItem.map((el) => (
//                         <MenuItem key={el?.keyValue} value={el?.keyValue}>
//                             {el?.keyName}
//                         </MenuItem>
//                     ))}
//             </StyledSelect>
//         </StyledContentWrapper>

//     )
// }

// export default InputDropdownField;
