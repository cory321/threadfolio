import { useContext } from 'react'

import { Grid, Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@/components/media/SingleFileUpload'
import GarmentClientLookup from '@components/garments/GarmentClientLookup'

const StepContent = ({
  step,
  userId,
  handleClientSubmit,
  handleGarmentSubmit,
  handleSummarySubmit,
  handleBack,
  onSubmit,
  steps
}) => {
  const { selectedClient, setSelectedClient, garmentDetails, setGarmentDetails, services, setServices } =
    useContext(GarmentServiceOrderContext)

  const { name, instructions, dueDate, isEvent, eventDate } = garmentDetails

  const handleInputChange = e => {
    const { name, value } = e.target

    setGarmentDetails(prev => ({ ...prev, [name]: value }))
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleClientSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <GarmentClientLookup
                  userId={userId}
                  onClientSelect={setSelectedClient}
                  selectedClient={selectedClient}
                />
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              <Grid item xs={12}>
                <h2>Garment Details</h2>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={3}>
                    <SingleFileUpload userId={userId} clientId={selectedClient.id} btnText='Upload Garment Photo' />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Grid item xs={12} sm={12} md={6} lg={4} sx={{ pt: { sm: '0', md: '1rem' }, pb: '0.5rem' }}>
                      <TextField
                        label='Garment Name'
                        name='name'
                        value={name}
                        onChange={handleInputChange}
                        margin='normal'
                        variant='outlined'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} sx={{ paddingBottom: '0.5rem' }}>
                      <AppReactDatepicker
                        selected={dueDate}
                        onChange={date => setGarmentDetails(prev => ({ ...prev, dueDate: date }))}
                        customInput={<DatePickerInput label='Due Date' dateFormat='EEEE, MMMM d, yyyy' />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isEvent}
                            onChange={() => setGarmentDetails(prev => ({ ...prev, isEvent: !isEvent }))}
                          />
                        }
                        label='Garment is for a special event'
                      />
                      {isEvent && (
                        <AppReactDatepicker
                          selected={eventDate}
                          onChange={date => setGarmentDetails(prev => ({ ...prev, eventDate: date }))}
                          customInput={<DatePickerInput label='Event Date' dateFormat='EEEE, MMMM d, yyyy' />}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <h2>Add Services</h2>
                <Grid item xs={12} sm={12}>
                  <ServiceLookup userId={userId} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Instructions and Notes'
                    multiline
                    rows={4}
                    name='instructions'
                    value={instructions}
                    onChange={handleInputChange}
                    margin='normal'
                    variant='outlined'
                  />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Button variant='outlined' onClick={handleBack} color='secondary'>
                  Back
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                <Typography variant='h6' color='textPrimary'>
                  {steps[2].title}
                </Typography>
                <Typography variant='body2'>{steps[2].subtitle}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Button variant='outlined' onClick={handleBack} color='secondary'>
                  Back
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' type='submit'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      default:
        return <Typography color='textPrimary'>Unknown stepIndex</Typography>
    }
  }

  return renderStep()
}

export default StepContent
