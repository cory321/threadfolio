import React, { useContext, useEffect, useState } from 'react'

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

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@components/media/SingleFileUpload'
import { getFirstName } from '@components/garments/utils/garmentUtils'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'

const GarmentDetailsDialog = ({ open, handleClose, userId, selectedClient, handleInputChange, isLoading }) => {
  const { garmentDetails, setGarmentDetails, services, setServices, garments, setGarments } =
    useContext(GarmentServiceOrderContext)
  const [isEditMode, setIsEditMode] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    setIsEditMode(garmentDetails.index !== undefined)

    if (garmentDetails.index !== undefined) {
      setServices(garmentDetails.services || [])
    } else {
      setServices([])
    }
  }, [garmentDetails, setServices])

  const handleDateChange = field => date => {
    setGarmentDetails(prev => ({ ...prev, [field]: date }))
  }

  const handleCheckboxChange = event => {
    const { name, checked } = event.target

    setGarmentDetails(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = () => {
    const newGarment = {
      user_id: userId,
      client_id: selectedClient.id,
      name: garmentDetails.name,
      image_cloud_id: garmentDetails.image_cloud_id,
      stage: 'new',
      notes: garmentDetails.notes,
      due_date: garmentDetails.due_date,
      is_event: garmentDetails.is_event,
      event_date: garmentDetails.event_date,
      services: services
    }

    if (isEditMode) {
      // Update existing garment
      const updatedGarments = [...garments]

      updatedGarments[garmentDetails.index] = newGarment
      setGarments(updatedGarments)
    } else {
      // Add new garment
      setGarments([...garments, newGarment])
    }

    setGarmentDetails({}) // Clear garment details
    setServices([]) // Clear services
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        {isEditMode ? 'Edit' : 'Add a new'} garment{' '}
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
                      minDate={new Date()}
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
                value={garmentDetails.notes || ''}
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
        <Button variant='contained' onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Save') + ' Garment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GarmentDetailsDialog
