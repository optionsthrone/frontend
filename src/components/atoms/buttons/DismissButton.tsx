import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const DismissButton = ({ ...extraProps }: ButtonProps) => {
  const StyledDismissButton = styled(Button)({
    color: '#fff',
    textAlign: 'initial',
    textDecoration: 'underline',
    padding: '0px',
    fontWeight: 'normal',
    fontSize: '14px',
    marginTop: '2px',
    textTransform: 'initial',
    letterSpacing: '0.5px',
  });

  return (
    <StyledDismissButton
      color='secondary'
      size='small'
      {...extraProps}
    >
      Dismiss
    </StyledDismissButton>
  );
};

export default DismissButton;