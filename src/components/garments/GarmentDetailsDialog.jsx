import React from 'react'

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

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup'
import SingleFileUpload from '@components/media/SingleFileUpload'
import { getFirstName } from '@components/garments/utils/garmentUtils'

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
                    minDate={new Date()}
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
                      minDate={new Date()}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <SingleFileUpload userId={userId} clientId={selectedClient.id} btnText='Upload Garment Photo' />
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

export default GarmentDetailsDialog
