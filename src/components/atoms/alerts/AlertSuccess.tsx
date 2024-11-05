import React from 'react';
import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { AlertProps } from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface IProps extends AlertProps {
  message: string;
}

const AlertSuccess = React.forwardRef<HTMLDivElement, IProps>(
  function AlertSuccess(props, ref) {
    const StyledAlertSuccess = styled(Alert)({
      width: '100%',
      backgroundColor: '#197E95',
      padding: '10px 16px',
      letterSpacing: '0.5px',
      '& .MuiAlert-icon': {
        fontSize: '24px',
        padding: '6px 0px',
        marginRight: '8px',
      },
    });

    return (
      <StyledAlertSuccess
        severity={'success'}
        variant={'filled'}
        className={'success'}
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize='inherit' />,
        }}
        ref={ref}
        {...props}
      >
        {props.message}
      </StyledAlertSuccess>
    );
  }
);

export default AlertSuccess;