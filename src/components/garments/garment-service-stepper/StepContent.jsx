// StepContent.jsx

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { Button, Checkbox, FormControlLabel, Grid, InputAdornment, TextField, Typography } from '@mui/material'

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

const GarmentUpload = ({ userId, selectedClient }) => (
  <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
    <SingleFileUpload userId={userId} clientId={selectedClient.id} btnText='Upload Garment Photo' />
  </Grid>
)

const GarmentDetails = ({ name, setName, dueDate, setDueDate }) => (
  <>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label='Garment Name'
        value={name}
        onChange={e => setName(e.target.value)}
        margin='normal'
        variant='outlined'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <i className='ri-t-shirt-line text-[24px]' />
            </InputAdornment>
          )
        }}
      />
    </Grid>
    <Grid item xs={12} sm={12}>
      <AppReactDatepicker
        selected={dueDate}
        onChange={date => setDueDate(date)}
        customInput={<DatePickerInput label='Due Date' dateFormat='MM/dd/yyyy' />}
      />
    </Grid>
  </>
)

const EventDetails = ({ isEvent, setIsEvent, eventDate, setEventDate }) => (
  <>
    <Grid item xs={12} sm={12}>
      <FormControlLabel
        control={<Checkbox checked={isEvent} onChange={() => setIsEvent(!isEvent)} />}
        label='Garment is for a special event'
      />
      {isEvent && (
        <AppReactDatepicker
          selected={eventDate}
          onChange={date => setEventDate(date)}
          customInput={<DatePickerInput label='Event Date' dateFormat='MM/dd/yyyy' />}
        />
      )}
    </Grid>
  </>
)

const ServiceInstructions = ({ userId, instructions, setInstructions }) => (
  <>
    <Grid item xs={12} sm={12}>
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
        variant='outlined'
      />
    </Grid>
  </>
)

const StepContent = ({
  step,
  userId,
  selectedClient,
  setSelectedClient,
  handleClientSubmit,
  handleGarmentSubmit,
  handleSummarySubmit,
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

  switch (step) {
    case 0:
      return (
        <form key={0} onSubmit={handleClientSubmit(onSubmit)}>
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
        <form key={1} onSubmit={handleGarmentSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={3}>
              <Grid item xs={12}>
                <h2>Add garment for {selectedClient && getFirstName(selectedClient.full_name)}</h2>
              </Grid>
              <GarmentUpload userId={userId} selectedClient={selectedClient} />
              <GarmentDetails name={name} setName={setName} dueDate={dueDate} setDueDate={setDueDate} />
              <EventDetails
                isEvent={isEvent}
                setIsEvent={setIsEvent}
                eventDate={eventDate}
                setEventDate={setEventDate}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid item xs={12} sm={12}>
                <h2>
                  Add services to {selectedClient && getFirstName(selectedClient.full_name)}&rsquo;s {name || 'garment'}
                </h2>
              </Grid>
              <ServiceInstructions userId={userId} instructions={instructions} setInstructions={setInstructions} />
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
        <form key={2} onSubmit={handleSummarySubmit(onSubmit)}>
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
