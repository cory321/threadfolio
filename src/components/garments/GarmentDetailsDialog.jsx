import React, { useContext, useEffect, useState, useRef } from 'react'

import {
  Grid,
  Box,
  Button,
  TextField,
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

import { v4 as uuidv4 } from 'uuid' // Importing UUID for unique IDs

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@components/media/SingleFileUpload'
import { getFirstName } from '@components/garments/utils/garmentUtils'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'

const GarmentDetailsDialog = ({ open, handleClose, userId, selectedClient, handleInputChange, isLoading }) => {
  const { garmentDetails, setGarmentDetails, services, setServices, addOrUpdateGarment } =
    useContext(GarmentServiceOrderContext)

  const [isEditMode, setIsEditMode] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))

  const notesRef = useRef(null)

  useEffect(() => {
    setIsEditMode(garmentDetails.id !== null)

    if (garmentDetails.id !== null) {
      setServices(garmentDetails.services || [])
    } else {
      setServices([])
    }
  }, [garmentDetails, setServices])

  // *** New useEffect to Clear Event Date if Due Date > Event Date ***
  useEffect(() => {
    if (
      garmentDetails.is_event &&
      garmentDetails.due_date &&
      garmentDetails.event_date &&
      new Date(garmentDetails.event_date) < new Date(garmentDetails.due_date)
    ) {
      setGarmentDetails(prev => ({
        ...prev,
        event_date: null
      }))
    }
  }, [garmentDetails.due_date, garmentDetails.event_date, garmentDetails.is_event, setGarmentDetails])

  // *** End of new useEffect ***

  const handleDateChange = field => date => {
    setGarmentDetails(prev => ({ ...prev, [field]: date }))
  }

  const handleCheckboxChange = event => {
    const { name, checked } = event.target

    setGarmentDetails(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = () => {
    // Additional validation to ensure Event Date is not before Due Date
    if (
      garmentDetails.is_event &&
      garmentDetails.event_date &&
      garmentDetails.due_date &&
      new Date(garmentDetails.event_date) < new Date(garmentDetails.due_date)
    ) {
      // Optionally, show an error message to the user
      alert('Event Date cannot be before Due Date.')

      return
    }

    const newGarment = {
      user_id: userId,
      client_id: selectedClient.id,
      name: garmentDetails.name,
      image_cloud_id: garmentDetails.image_cloud_id,
      stage: 'not started', // Modify as needed
      notes: notesRef.current ? notesRef.current.value : '',
      due_date: garmentDetails.due_date,
      is_event: garmentDetails.is_event,
      event_date: garmentDetails.event_date,
      services: services,
      id: garmentDetails.id || uuidv4() // Assign unique ID if new
    }

    addOrUpdateGarment(newGarment)

    // Clear garment details and services
    setGarmentDetails({
      id: null,
      name: '',
      instructions: '',
      due_date: null,
      is_event: false,
      event_date: null,
      image_cloud_id: '',
      image_metadata: { width: 0, height: 0 },
      services: []
    })
    setServices([])

    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        {isEditMode ? 'Edit' : 'Add a New'} Garment{' '}
        {selectedClient.full_name && `for ${getFirstName(selectedClient.full_name)}`}
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
              <Grid item xs={12} md={9}>
                <Grid item xs={12} sm={12} md={6} lg={4} sx={{ pt: { sm: '0', md: '1rem' }, pb: '0.5rem' }}>
                  <TextField
                    label='Garment Name'
                    name='name'
                    value={garmentDetails.name || ''}
                    onChange={handleInputChange}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    disabled={isLoading}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} sx={{ paddingBottom: '0.5rem' }}>
                  <AppReactDatepicker
                    selected={garmentDetails.due_date ? new Date(garmentDetails.due_date) : null}
                    onChange={handleDateChange('due_date')}
                    customInput={<DatePickerInput label='Due Date' dateFormat='EEEE, MMMM d, yyyy' />}
                    disabled={isLoading}
                    minDate={new Date()}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={garmentDetails.is_event || false}
                        onChange={handleCheckboxChange}
                        name='is_event'
                        disabled={isLoading}
                      />
                    }
                    label='Garment is for a special event'
                  />
                  {garmentDetails.is_event && (
                    <AppReactDatepicker
                      selected={garmentDetails.event_date ? new Date(garmentDetails.event_date) : null}
                      onChange={handleDateChange('event_date')}
                      customInput={<DatePickerInput label='Event Date' dateFormat='EEEE, MMMM d, yyyy' />}
                      disabled={isLoading}
                      minDate={garmentDetails.due_date ? new Date(garmentDetails.due_date) : new Date()}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <SingleFileUpload
                  userId={userId}
                  clientId={selectedClient.id}
                  btnText={isEditMode ? 'Change Garment Photo' : 'Upload Garment Photo'}
                  initialImage={garmentDetails.image_cloud_id}
                  onUploadSuccess={imageId =>
                    setGarmentDetails(prev => ({
                      ...prev,
                      image_cloud_id: imageId
                    }))
                  }
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <h2>Add Services</h2>
            <Grid item xs={12} sm={12}>
              <ServiceLookup userId={userId} isGarmentSaving={isLoading} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Instructions and Notes'
                multiline
                rows={4}
                name='notes'
                inputRef={notesRef}
                defaultValue={garmentDetails.notes || ''}
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
        <Button variant='contained' onClick={handleSave} disabled={isLoading || !garmentDetails.name}>
          {isLoading ? 'Saving...' : isEditMode ? 'Update Garment' : 'Save Garment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GarmentDetailsDialog
