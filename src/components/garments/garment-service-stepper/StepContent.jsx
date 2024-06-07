// StepContent.jsx

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@/components/media/SingleFileUpload'
import GarmentClientLookup from '@components/garments/GarmentClientLookup'

const ServicesSearch = dynamic(() => import('@components/services/ServicesSearch'), {
  ssr: false,
  loading: LoadingSpinner
})

const StepContent = ({
  step,
  userId,
  selectedClient,
  setSelectedClient,
  handleAccountSubmit,
  handlePersonalSubmit,
  handleSocialSubmit,
  handleBack,
  onSubmit,
  getFirstName,
  steps // Added steps as a prop
}) => {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [instructions, setInstructions] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [isEvent, setIsEvent] = useState(false)
  const [eventDate, setEventDate] = useState(null)

  const handleImageUpload = event => {
    setImage(event.target.files[0])
  }

  const handleGarmentSubmit = event => {
    event.preventDefault()

    // Handle form submission
  }

  switch (step) {
    case 0:
      return (
        <form key={0} onSubmit={handleAccountSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <GarmentClientLookup userId={userId} onClientSelect={setSelectedClient} selectedClient={selectedClient} />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6} className='flex justify-end'>
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
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <h2>Add garment for {selectedClient && getFirstName(selectedClient.full_name)}</h2>
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SingleFileUpload userId={userId} clientId={selectedClient.id} btnText='Upload Garment Photo' />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label='Garment Name'
                value={name}
                onChange={e => setName(e.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <h2>
                Add services to {selectedClient && getFirstName(selectedClient.full_name)}'s {name || 'garment'}
              </h2>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  {/* <ServicesSearch userId={userId} /> */}
                  <ServiceLookup userId={userId} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Instructions and Notes'
                    multiline
                    rows={4}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <AppReactDatepicker
                    selected={dueDate}
                    onChange={date => setDueDate(date)}
                    customInput={<DatePickerInput label='Due Date' dateFormat='EEEE, MMMM d, yyyy' />}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControlLabel
                    control={<Checkbox checked={isEvent} onChange={() => setIsEvent(!isEvent)} />}
                    label='For Event'
                  />
                  {isEvent && (
                    <AppReactDatepicker
                      selected={eventDate}
                      onChange={date => setEventDate(date)}
                      customInput={<DatePickerInput label='Event Date' dateFormat='EEEE, MMMM d, yyyy' />}
                    />
                  )}
                </Grid>
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
          </Grid>
        </form>
      )
    default:
      return <Typography color='text.primary'>Unknown stepIndex</Typography>
  }
}

export default StepContent
