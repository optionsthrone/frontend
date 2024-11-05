import { Checkbox, CheckboxProps, FormControlLabel, styled } from '@mui/material'
import { UseControllerProps } from 'react-hook-form'

type IProps = {
    label?: string
} & CheckboxProps & UseControllerProps;


const StyledFormControlLabel = styled(FormControlLabel)({
    color:"#fff",
    "& .MuiCheckbox-root.Mui-disabled": {
        color: "#fff",
        opacity: 0.5
    },
    "& .MuiFormControlLabel-label.Mui-disabled": {
        color: "#fff",
        opacity: 0.5
    }
});

const StyledCheckbox = styled(Checkbox)({
    color: "#fff",
});

const InputCheckboxField = ({
    name,
    label,
    onChange,
    value,
    disabled,
    readOnly
}: IProps) => {
    return (
        <StyledFormControlLabel
            control={
                <StyledCheckbox
                    name={name}
                    onChange={onChange}
                    checked={Boolean(value) || false}
                    disabled={disabled}
                    readOnly={readOnly}
                />
            }
            label={label}
        />
    )
}

export default InputCheckboxField


// import { Box, Checkbox, CheckboxProps, FormControlLabel, styled } from '@mui/material'
// import { UseControllerProps } from 'react-hook-form';

// const StyledContentWrapper = styled(Box)({
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "5px 0px"
// });


// const StyledFormControlLabel = styled(FormControlLabel)({
//     '& .MuiCheckbox-root': {
//         color: "#fff"
//     },
//     '& .MuiCheckbox-root.Mui-checked': {
//         color: "#fff",
//     },
//     '& .Mui-disabled': {
//         opacity: 0.5
//     },
//     '& .MuiFormControlLabel-label.Mui-disabled': {
//         color: "#fff"
//     }
// });

// type IProps = {
//     label?: string,
//     handleChange: (...event: any[]) => void
// } & CheckboxProps & UseControllerProps;


// const InputCheckboxField = ({
//     label,
//     handleChange,
//     disabled,
//     ...extraProps
// }: IProps) => {
//     return (
//         <StyledContentWrapper>
//             <StyledFormControlLabel
//                 control={
//                     <Checkbox
//                         onChange={handleChange}
//                         checked={Boolean(extraProps.value)}
//                         disabled={disabled}
//                     />
//                 }
//                 label={label}
//             />
//         </StyledContentWrapper>
//     )
// }

// export default InputCheckboxField;
