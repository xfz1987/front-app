import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = ['填写信息', '查看报告'];

  return (
    <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
      <Stepper activeStep={currentStep - 1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={index < currentStep - 1}>
            <StepLabel
              StepIconComponent={
                index < currentStep - 1
                  ? () => <CheckCircle color="success" />
                  : undefined
              }
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
