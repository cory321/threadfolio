import React, { useContext, useState } from 'react'

import {
  Grid,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@/components/media/SingleFileUpload'
import GarmentClientLookup from '@components/garments/GarmentClientLookup'
import { StyledUploadButton } from '@components/media/styles/SingleFileUploadWithGalleryStyles'

const getFirstName = fullName => {
  if (!fullName) return ''
  const nameParts = fullName.trim().split(' ')

  return nameParts[0]
}

const AddGarmentButton = ({ handleClickOpen, btnText }) => (
  <Grid container sx={{ padding: 10 }}>
    <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
      <i className='ri-t-shirt-line' />
      <Typography variant='body2'>{btnText}</Typography>
    </StyledUploadButton>
  </Grid>
)

const GarmentDetailsDialog = ({
  open,
  handleClose,
  userId,
  selectedClient,
  garmentDetails,
  setGarmentDetails,
  handleInputChange,
  handleGarmentSave
}) => {
  const { name, instructions, dueDate, isEvent, eventDate } = garmentDetails
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        Add a new garment {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`}
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='text' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' onClick={handleGarmentSave}>
          Save Garment
        </Button>
      </DialogActions>
    </Dialog>
  )
}

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
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target

    setGarmentDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleGarmentSave = () => {
    const garmentData = {
      user_id: userId,
      client_id: selectedClient.id,
      name: garmentDetails.name,
      image_cloud_id: garmentDetails.image_cloud_id,
      stage: 'new', // assuming 'new' as a default stage, modify as needed
      notes: garmentDetails.instructions,
      due_date: garmentDetails.dueDate,
      is_event: garmentDetails.isEvent,
      event_date: garmentDetails.eventDate,
      services: services.map(service => ({
        name: service.name,
        description: service.description,
        qty: service.qty,
        unit_price: service.unit_price,
        unit: service.unit
      }))
    }

    console.log(garmentData)
    handleDialogClose()
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
          <>
            <form key={1} onSubmit={handleGarmentSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <h2>Add Garments {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`} </h2>
                  <AddGarmentButton btnText='Add Garment' handleClickOpen={handleDialogOpen} />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
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
            <GarmentDetailsDialog
              open={dialogOpen}
              handleClose={handleDialogClose}
              userId={userId}
              selectedClient={selectedClient}
              garmentDetails={garmentDetails}
              setGarmentDetails={setGarmentDetails}
              handleInputChange={handleInputChange}
              handleGarmentSave={handleGarmentSave}
            />
          </>
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
