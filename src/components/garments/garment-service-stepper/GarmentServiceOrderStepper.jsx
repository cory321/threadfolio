'use client'

import React, { useState } from 'react'

import { Box, Button, Card, CardContent, Divider, Stepper, Step, StepLabel, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from './StepperCustomDot'
import StepContent from './StepContent'

const steps = [
  { title: 'Client Details', subtitle: 'Add or find a client' },
  { title: 'Add Garments and Services', subtitle: 'Upload photos and add details' },
  { title: 'Order Summary', subtitle: 'Generate invoice and send to client' }
]

const GarmentServiceOrderStepper = ({ userId }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedClient, setSelectedClient] = useState(null)

  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  })

  const {
    reset: personalReset,
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors }
  } = useForm({
    defaultValues: { firstName: '', lastName: '', country: '', language: [] }
  })

  const {
    reset: socialReset,
    control: socialControl,
    handleSubmit: handleSocialSubmit,
    formState: { errors: socialErrors }
  } = useForm({
    defaultValues: { twitter: '', facebook: '', google: '', linkedIn: '' }
  })

  const onSubmit = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1)

  const handleReset = () => {
    setActiveStep(0)
    accountReset({ email: '', username: '', password: '', confirmPassword: '' })
    personalReset({ firstName: '', lastName: '', country: '', language: [] })
    socialReset({ twitter: '', facebook: '', google: '', linkedIn: '' })
  }

  const getFirstName = fullName => (fullName ? fullName.split(' ')[0] : '')

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const labelProps = {}

              if (index === activeStep) {
                labelProps.error = false

                if (
                  (accountErrors.email ||
                    accountErrors.username ||
                    accountErrors.password ||
                    accountErrors['confirmPassword']) &&
                  activeStep === 0
                ) {
                  labelProps.error = true
                } else if (
                  (personalErrors.firstName ||
                    personalErrors.lastName ||
                    personalErrors.country ||
                    personalErrors.language) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else if (
                  (socialErrors.google || socialErrors.twitter || socialErrors.facebook || socialErrors.linkedIn) &&
                  activeStep === 2
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number' color='text.primary'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title' color='text.primary'>
                          {label.title}
                        </Typography>
                        <Typography className='step-subtitle' color='text.primary'>
                          {label.subtitle}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>
      <Divider />
      <CardContent>
        {activeStep === steps.length ? (
          <>
            <Typography className='mlb-2 mli-1' color='text.primary'>
              All steps are completed!
            </Typography>
            <Box display='flex' justifyContent='flex-end' mt={4}>
              <Button variant='contained' onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </>
        ) : (
          <StepContent
            step={activeStep}
            userId={userId}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            handleAccountSubmit={handleAccountSubmit}
            handlePersonalSubmit={handlePersonalSubmit}
            handleSocialSubmit={handleSocialSubmit}
            handleBack={handleBack}
            onSubmit={onSubmit}
            getFirstName={getFirstName}
            steps={steps} // Pass steps as a prop
          />
        )}
      </CardContent>
    </Card>
  )
}

export default GarmentServiceOrderStepper
