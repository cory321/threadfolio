'use client'
import React, { useContext } from 'react'

import Link from 'next/link'

import { Box, Button, Card, CardContent, Divider, Stepper, Step, StepLabel, Typography } from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import QrCode2Icon from '@mui/icons-material/QrCode2'

import { useForm } from 'react-hook-form'

import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from './StepperCustomDot'
import StepContent from './StepContent'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'

const steps = [
  { title: 'Client Details', subtitle: 'Add or search for client' },
  { title: 'Add Garments and Services', subtitle: 'Add garment details and append services' },
  { title: 'Order Summary', subtitle: 'Generate invoice and send to client' }
]

const GarmentServiceOrderStepper = ({ userId }) => {
  const { activeStep, setActiveStep, selectedClient, setSelectedClient } = useContext(GarmentServiceOrderContext)

  const {
    reset: clientReset,
    control: clientControl,
    handleSubmit: handleClientSubmit,
    formState: { errors: accountErrors }
  } = useForm({ defaultValues: {} })

  const {
    reset: garmentReset,
    control: garmentControl,
    handleSubmit: handleGarmentSubmit,
    formState: { errors: personalErrors }
  } = useForm({ defaultValues: {} })

  const {
    reset: summaryReset,
    control: summaryControl,
    handleSubmit: handleSummarySubmit,
    formState: { errors: socialErrors }
  } = useForm({ defaultValues: {} })

  const onSubmit = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1)

  const handleReset = () => {
    setActiveStep(0)
    clientReset({ email: '', username: '', password: '', confirmPassword: '' })
    garmentReset({ firstName: '', lastName: '', country: '', language: [] })
    summaryReset({ twitter: '', facebook: '', google: '', linkedIn: '' })
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
            <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' mt={4}>
              <Typography variant='h4' color='text.primary'>
                Order created!
              </Typography>
              <Typography color='text.primary'>Order #0000 has been added to your list of orders.</Typography>
              <Box display='flex' justifyContent='center' alignItems='center' flexDirection='row' mt={4} gap={2}>
                <Button variant='outlined' sx={{ mt: 2, flexDirection: 'column', alignItems: 'center' }}>
                  <ReceiptIcon sx={{ fontSize: 40, mb: 1 }} />
                  View Invoice
                </Button>
                <Button variant='outlined' sx={{ mt: 2, flexDirection: 'column', alignItems: 'center' }}>
                  <QrCode2Icon sx={{ fontSize: 40, mb: 1 }} />
                  View QR Code
                </Button>
              </Box>
            </Box>
            <Box display='flex' justifyContent='flex-end' mt={4}>
              <Button variant='outlined' onClick={handleReset} sx={{ mr: 2 }}>
                Create Order
              </Button>
              <Link href='/orders'>
                <Button variant='contained' component='a'>
                  View All Orders
                </Button>
              </Link>
            </Box>
          </>
        ) : (
          <StepContent
            step={activeStep}
            userId={userId}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            handleClientSubmit={handleClientSubmit}
            handleGarmentSubmit={handleGarmentSubmit}
            handleSummarySubmit={handleSummarySubmit}
            handleBack={handleBack}
            onSubmit={onSubmit}
            getFirstName={getFirstName}
            steps={steps}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default GarmentServiceOrderStepper
