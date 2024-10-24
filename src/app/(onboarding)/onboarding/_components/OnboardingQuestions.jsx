import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress
} from '@mui/material'

import { toast } from 'react-toastify' // Import toast

import { setHours, setMinutes } from 'date-fns'

import Logo from '@/components/layout/shared/Logo'

import { saveBusinessInfo } from '@/app/actions/users'
import BusinessHours from '@components/business-information/BusinessHours'
import AddressForm from './AddressForm'
import { daysOfWeek } from '@/utils/dateTimeUtils'

const OnboardingQuestions = () => {
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()

  // Default open and close times
  const defaultOpenTime = setHours(setMinutes(new Date(), 0), 9)
  const defaultCloseTime = setHours(setMinutes(new Date(), 0), 17)

  const [answers, setAnswers] = useState({
    shopName: '',
    businessPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'none',
    postalCode: '',
    country: 'none',
    isMeetingLocation: true,
    businessHours: daysOfWeek.map(day => {
      const isOpenDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)

      return {
        day,
        isOpen: isOpenDay,
        intervals: isOpenDay ? [{ openTime: defaultOpenTime, closeTime: defaultCloseTime }] : []
      }
    }),
    timezone: ''
  })

  const [isLoading, setIsLoading] = useState(false) // Loading state

  /**
   * Handles changes for non-address fields.
   */
  const handleInputChange = event => {
    const { name, value } = event.target

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [name]: value
    }))
  }

  /**
   * Handles checkbox changes.
   */
  const handleCheckboxChange = event => {
    const { name, checked } = event.target

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [name]: checked
    }))
  }

  /**
   * Handles changes from AddressForm.
   *
   * @param {string} field - The field name.
   * @param {string} value - The new value.
   */
  const handleAddressChange = (field, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [field]: value,
      ...(field === 'country' ? { state: 'none' } : {})
    }))
  }

  /**
   * Updates business hours.
   */
  const setBusinessHours = updatedHours => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      businessHours: updatedHours
    }))
  }

  /**
   * Moves to the next step.
   */
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  /**
   * Moves to the previous step.
   */
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  /**
   * Handles the completion of the onboarding process.
   */
  const handleComplete = async () => {
    setIsLoading(true) // Start loading

    try {
      const result = await saveBusinessInfo(answers)

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false) // Stop loading on error

        return
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving business info:', error)
      toast.error('An unexpected error occurred. Please try again.') // Display generic error
    } finally {
      setIsLoading(false) // Ensure loading stops after operation
    }
  }

  // Capture user's timezone on component mount
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      timezone: userTimezone
    }))
  }, [])

  const steps = [
    {
      label: 'Business Information',
      content: (
        <Box sx={{ p: 2, maxWidth: 300, margin: 'auto' }}>
          <Typography variant='h6' gutterBottom>
            {"What's the name of your business?"}
          </Typography>
          <TextField
            fullWidth
            required
            size='small'
            label='Shop Name'
            name='shopName'
            value={answers.shopName}
            onChange={handleInputChange}
            variant='outlined'
            sx={{ mb: 4 }}
          />
          <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
            {"What's your business phone number?"}
          </Typography>
          <TextField
            fullWidth
            required
            size='small'
            label='Business Phone'
            name='businessPhone'
            value={answers.businessPhone}
            onChange={handleInputChange}
            variant='outlined'
            sx={{ mb: 4 }}
          />
        </Box>
      )
    },
    {
      label: 'Business Location',
      content: (
        <Box sx={{ p: 2, maxWidth: 680, margin: 'auto' }}>
          <AddressForm
            formData={{
              country: answers.country,
              addressLine1: answers.addressLine1,
              addressLine2: answers.addressLine2,
              city: answers.city,
              state: answers.state,
              postalCode: answers.postalCode
            }}
            handleChange={handleAddressChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCheckboxChange}
                name='isMeetingLocation'
                defaultChecked={answers.isMeetingLocation}
              />
            }
            label='Use this address for client appointments'
            sx={{ mt: 6 }}
          />
        </Box>
      )
    },
    {
      label: 'Business Hours',
      content: (
        <Box sx={{ p: 2, maxWidth: 680, margin: 'auto' }}>
          <Typography variant='h6' sx={{ mb: 6 }}>
            What are your business hours?
          </Typography>
          <BusinessHours businessHours={answers.businessHours} setBusinessHours={setBusinessHours} />
        </Box>
      )
    }
  ]

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Logo />
      </Box>
      <Typography variant='h1' align='center' sx={{ mb: 8, fontSize: 20 }}>
        Welcome to Threadfolio! Please answer a few questions to get started.
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
        <Button disabled={activeStep === 0 || isLoading} onClick={handleBack}>
          Back
        </Button>
        <Button
          variant='contained'
          onClick={activeStep === steps.length - 1 ? handleComplete : handleNext}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} sx={{ color: 'white' }} />}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  )
}

export default OnboardingQuestions
