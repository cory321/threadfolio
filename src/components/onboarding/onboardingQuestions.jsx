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

import { daysOfWeek } from '@/utils/dateTimeUtils'

const OnboardingQuestions = ({ userData, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()

  const [answers, setAnswers] = useState({
    shopName: '',
    businessPhone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isPickupAddress: false,
    businessHours: daysOfWeek.map(day => ({
      day,
      isOpen: false,
      intervals: [] // Start with empty intervals
    }))
  })

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleInputChange = event => {
    const { name, value } = event.target

    setAnswers(prevAnswers => ({ ...prevAnswers, [name]: value }))
  }

  const handleCheckboxChange = event => {
    const { name, checked } = event.target

    setAnswers(prevAnswers => ({ ...prevAnswers, [name]: checked }))
  }

  const handleRadioChange = event => {
    const { name, value } = event.target

    setAnswers(prevAnswers => ({ ...prevAnswers, [name]: value }))
  }

  const setBusinessHours = updatedHours => {
    setAnswers(prevAnswers => ({ ...prevAnswers, businessHours: updatedHours }))
  }

  // Update the handleComplete function
  const handleComplete = () => {
    router.push('/dashboard')
  }

  const steps = [
    {
      label: 'Business Information',
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            {"What's the name of your business?"}
          </Typography>
          <TextField
            fullWidth
            label='Shop Name'
            name='shopName'
            value={answers.shopName}
            onChange={handleInputChange}
            margin='normal'
          />
          <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
            {"What's your business phone number?"}
          </Typography>
          <TextField
            fullWidth
            label='Business Phone'
            name='businessPhone'
            value={answers.businessPhone}
            onChange={handleInputChange}
            margin='normal'
          />
        </Box>
      )
    },
    {
      label: 'Business Location',
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            {"What's your business location?"}
          </Typography>
          <TextField
            fullWidth
            label='Street Address'
            name='streetAddress'
            value={answers.streetAddress}
            onChange={handleInputChange}
            margin='normal'
          />
          <TextField
            fullWidth
            label='City'
            name='city'
            value={answers.city}
            onChange={handleInputChange}
            margin='normal'
          />
          <TextField
            fullWidth
            label='State/Province'
            name='state'
            value={answers.state}
            onChange={handleInputChange}
            margin='normal'
          />
          <TextField
            fullWidth
            label='Postal Code'
            name='postalCode'
            value={answers.postalCode}
            onChange={handleInputChange}
            margin='normal'
          />
          <TextField
            fullWidth
            label='Country'
            name='country'
            value={answers.country}
            onChange={handleInputChange}
            margin='normal'
          />
          <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
            Is this address where in-person fittings and order pickups will happen?
          </Typography>
          <FormControlLabel
            control={
              <Checkbox checked={answers.isPickupAddress} onChange={handleCheckboxChange} name='isPickupAddress' />
            }
            label='Yes, this is the order pickup address'
          />
        </Box>
      )
    },
    {
      label: 'Business Hours',
      content: (
        <Box>
          <Typography variant='h6' gutterBottom>
            What are your business hours?
          </Typography>
          <BusinessHours businessHours={answers.businessHours} setBusinessHours={setBusinessHours} />
        </Box>
      )
    }
  ]

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 4, gap: 4 }}>
      <Typography variant='h4' gutterBottom>
        Welcome to Threadfolio!
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(step => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>{steps[activeStep].content}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant='contained' onClick={activeStep === steps.length - 1 ? handleComplete : handleNext}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  )
}

export default OnboardingQuestions
