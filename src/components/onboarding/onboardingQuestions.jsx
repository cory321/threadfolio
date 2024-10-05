import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Paper
} from '@mui/material'

import BusinessHours from '@components/business-information/BusinessHours'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const OnboardingQuestions = ({ userData, onComplete }) => {
  return <div>OnboardingQuestions</div>
}

export default OnboardingQuestions
