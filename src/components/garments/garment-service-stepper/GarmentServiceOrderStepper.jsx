'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, array, forward, custom } from 'valibot'

// Component Imports
import GarmentClientLookup from '@components/garments/GarmentClientLookup'
import GarmentEntryForm from '@components/garments/GarmentEntryForm'
import AddGarmentCard from '@components/garments/AddGarmentCard'

import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from './StepperCustomDot'

// Vars
const steps = [
  {
    title: 'Client Details',
    subtitle: 'Add or find a client'
  },
  {
    title: 'Add Garments and Services',
    subtitle: 'Upload photos and add details'
  },
  {
    title: 'Order Summary',
    subtitle: 'Generate invoice and send to client'
  }
]

const accountSchema = object(
  {
    username: string([minLength(1, 'This field is required')]),
    email: string([minLength(1, 'This field is required'), email()]),
    password: string([
      minLength(1, 'This field is required'),
      minLength(8, 'Password must be at least 8 characters long')
    ]),
    confirmPassword: string([minLength(1, 'This field is required')])
  },
  [
    forward(
      custom(input => input.password === input.confirmPassword, 'Passwords do not match.'),
      ['confirmPassword']
    )
  ]
)

const personalSchema = object({
  firstName: string([minLength(1, 'This field is required')]),
  lastName: string([minLength(1, 'This field is required')]),
  country: string([minLength(1, 'This field is required')]),
  language: array(string(), [minLength(1, 'This field is required')])
})

const socialSchema = object({
  twitter: string([minLength(1, 'This field is required')]),
  facebook: string([minLength(1, 'This field is required')]),
  google: string([minLength(1, 'This field is required')]),
  linkedIn: string([minLength(1, 'This field is required')])
})

const GarmentServiceOrderStepper = ({ userId }) => {
  // States
  const [activeStep, setActiveStep] = useState(0)
  const [selectedClient, setSelectedClient] = useState(null)

  // Vars
  const Languages = ['English', 'French', 'Spanish', 'Portuguese', 'Italian', 'German', 'Arabic']

  // Hooks
  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    resolver: valibotResolver(accountSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const {
    reset: personalReset,
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors }
  } = useForm({
    resolver: valibotResolver(personalSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      language: []
    }
  })

  const {
    reset: socialReset,
    control: socialControl,
    handleSubmit: handleSocialSubmit,
    formState: { errors: socialErrors }
  } = useForm({
    resolver: valibotResolver(socialSchema),
    defaultValues: {
      twitter: '',
      facebook: '',
      google: '',
      linkedIn: ''
    }
  })

  const onSubmit = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    accountReset({ email: '', username: '', password: '', confirmPassword: '' })
    personalReset({ firstName: '', lastName: '', country: '', language: [] })
    socialReset({ twitter: '', facebook: '', google: '', linkedIn: '' })
    setIsPasswordShown(false)
    setIsConfirmPasswordShown(false)
  }

  const getFirstName = fullName => {
    return fullName ? fullName.split(' ')[0] : ''
  }

  const renderStepContent = activeStep => {
    switch (activeStep) {
      case 0:
        return (
          <form key={0} onSubmit={handleAccountSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={12}>
                <GarmentClientLookup
                  userId={userId}
                  onClientSelect={setSelectedClient}
                  selectedClient={selectedClient}
                />
              </Grid>
              <Grid item xs={12} className='flex justify-between'>
                <Button variant='outlined' disabled color='secondary'>
                  Back
                </Button>
                <Button variant='contained' type='submit' disabled={!selectedClient}>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handlePersonalSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h2>Add Garments for {selectedClient && getFirstName(selectedClient.full_name)}</h2>
              </Grid>
              <Grid item xs={6}>
                <AddGarmentCard />
              </Grid>

              <Grid item xs={6}>
                {/* <ul>
                  <li>Garment name</li>
                  <li>Garment stage (hidden) [not started, working on it, done, stuck, archived]</li>
                  <li>add garment image</li>
                  <li>Add services to garment</li>
                  <li>detailed instructions and notes</li>
                  <li>due date</li>
                  <li>is this garment for an event?</li>
                  <li>if yes, add event date and event type</li>
                  <li>add garment button</li>
                </ul> */}
              </Grid>

              <Grid item xs={12}>
                <GarmentEntryForm />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Button variant='outlined' onClick={handleBack} color='secondary'>
                Back
              </Button>
            </Grid>

            <Grid item xs={6} className='flex justify-end'>
              <Button variant='contained' type='submit'>
                Next
              </Button>
            </Grid>
          </form>
        )
      case 2:
        return (
          <form key={2} onSubmit={handleSocialSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography className='font-medium' color='text.primary'>
                  {steps[2].title}
                </Typography>
                <Typography variant='body2'>{steps[2].subtitle}</Typography>
              </Grid>
              <Grid item xs={12} className='flex justify-between'>
                <Button variant='outlined' onClick={handleBack} color='secondary'>
                  Back
                </Button>
                <Button variant='contained' type='submit'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      default:
        return <Typography color='text.primary'>Unknown stepIndex</Typography>
    }
  }

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
            <div className='flex justify-end mt-4'>
              <Button variant='contained' onClick={handleReset}>
                Reset
              </Button>
            </div>
          </>
        ) : (
          renderStepContent(activeStep)
        )}
      </CardContent>
    </Card>
  )
}

export default GarmentServiceOrderStepper
