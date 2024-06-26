import React, { useContext, useState } from 'react'

import {
  Grid,
  Box,
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
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import { CldImage } from 'next-cloudinary'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@/components/media/SingleFileUpload'
import GarmentClientLookup from '@components/garments/GarmentClientLookup'
import { StyledUploadButton } from '@components/media/styles/SingleFileUploadWithGalleryStyles'
import { addGarment } from '@actions/garments'

const getFirstName = fullName => {
  if (!fullName) return ''
  const nameParts = fullName.trim().split(' ')

  return nameParts[0]
}

const AddGarmentButton = ({ handleClickOpen, btnText }) => (
  <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
    <i className='ri-t-shirt-line' />
    <Typography variant='body2'>{btnText}</Typography>
  </StyledUploadButton>
)

const GarmentDetailsDialog = ({
  open,
  handleClose,
  userId,
  selectedClient,
  garmentDetails,
  setGarmentDetails,
  handleInputChange,
  handleGarmentSave,
  isLoading
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
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} sx={{ paddingBottom: '0.5rem' }}>
                  <AppReactDatepicker
                    selected={dueDate}
                    onChange={date => setGarmentDetails(prev => ({ ...prev, dueDate: date }))}
                    customInput={<DatePickerInput label='Due Date' dateFormat='EEEE, MMMM d, yyyy' />}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isEvent}
                        onChange={() => setGarmentDetails(prev => ({ ...prev, isEvent: !isEvent }))}
                        disabled={isLoading}
                      />
                    }
                    label='Garment is for a special event'
                  />
                  {isEvent && (
                    <AppReactDatepicker
                      selected={eventDate}
                      onChange={date => setGarmentDetails(prev => ({ ...prev, eventDate: date }))}
                      customInput={<DatePickerInput label='Event Date' dateFormat='EEEE, MMMM d, yyyy' />}
                      disabled={isLoading}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <h2>Add Services</h2>
            <Grid item xs={12} sm={12}>
              <ServiceLookup userId={userId} disabled={isLoading} />
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
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='text' onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant='contained' onClick={handleGarmentSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Garment'}
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
  const {
    selectedClient,
    setSelectedClient,
    garmentDetails,
    setGarmentDetails,
    services,
    setServices,
    orderId,
    setOrderId,
    garments,
    setGarments
  } = useContext(GarmentServiceOrderContext)

  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleGarmentSave = async () => {
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
      })),
      order_id: orderId // Use the existing orderId
    }

    try {
      setIsLoading(true)
      const token = await getToken({ template: 'supabase' })
      const newGarment = await addGarment(userId, selectedClient.id, garmentData, token)

      toast.success(`${newGarment.garment.name} has been added!`)

      // If no orderId exists, set the new orderId
      if (!orderId) {
        setOrderId(newGarment.order.id)
      }

      // Add the new garment to the garments state
      setGarments(prevGarments => [...prevGarments, newGarment.garment])

      // Clear garment details form
      setGarmentDetails({
        name: '',
        image_cloud_id: '',
        instructions: '',
        dueDate: null,
        isEvent: false,
        eventDate: null,
        image_metadata: { width: 0, height: 0 } // Reset image metadata
      })
    } catch (error) {
      toast.error(`Error adding garment: ${error.message}`)
      console.error('Error adding garment:', error)
    } finally {
      setIsLoading(false)
    }

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
              <h2>Add Garments {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`} </h2>
              <Grid container sx={{ pt: 10, pb: 10 }}>
                <Grid item xs={12}>
                  <Grid container spacing={6}>
                    <Grid item>
                      <AddGarmentButton btnText='Add Garment' handleClickOpen={handleDialogOpen} />
                    </Grid>
                    {garments.length > 0 &&
                      garments.map((garment, index) => (
                        <Grid item key={index}>
                          {garment.image_cloud_id ? (
                            <CldImage
                              src={garment.image_cloud_id}
                              alt={garment.name}
                              width={150}
                              height={150}
                              crop='fill'
                              quality='auto'
                              fetchformat='auto'
                              style={{ borderRadius: '10px', transition: '0.3s' }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 150,
                                height: 150,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid grey',
                                borderRadius: '10px'
                              }}
                            >
                              <i className='ri-t-shirt-line' style={{ fontSize: '2rem', color: 'grey' }} />
                            </Box>
                          )}
                          <Typography variant='h6' align='center'>
                            {garment.name}
                          </Typography>
                        </Grid>
                      ))}
                  </Grid>
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
              isLoading={isLoading}
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
