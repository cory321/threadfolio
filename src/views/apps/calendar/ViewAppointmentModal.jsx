import React, { useState } from 'react'

import Link from 'next/link'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  IconButton
} from '@mui/material'
import { toast } from 'react-toastify'

import { Event, LocationOn, Person, Notes, Cancel } from '@mui/icons-material'

import { cancelAppointment } from '@/app/actions/appointments'

const ViewAppointmentModal = ({ open, handleClose, selectedEvent, onAppointmentCancelled, refreshEvents }) => {
  const [isCancelling, setIsCancelling] = useState(false)

  if (!selectedEvent) return null

  const handleCancel = async () => {
    setIsCancelling(true)

    try {
      await cancelAppointment(selectedEvent.id)
      onAppointmentCancelled(selectedEvent.id)
      toast.success('Appointment successfully cancelled')
      handleClose()

      // Check if refreshEvents is provided before calling it
      if (refreshEvents) {
        refreshEvents()
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Failed to cancel appointment. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  const formatDate = date => {
    return date
      ? new Date(date).toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Not set'
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
          {selectedEvent.title || 'Untitled Appointment'}
        </Typography>
        <IconButton aria-label='close' onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Cancel />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' mb={2}>
              <Event color='primary' sx={{ mr: 1 }} />
              <Typography variant='subtitle1' component='div'>
                {formatDate(selectedEvent.start)} - {formatDate(selectedEvent.end)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' mb={2}>
              <Person color='primary' sx={{ mr: 1 }} />
              <Typography variant='subtitle1' component='div'>
                Client:{' '}
                {selectedEvent.extendedProps?.clientId ? (
                  <Link href={`/clients/${selectedEvent.extendedProps.clientId}`} passHref>
                    <Typography
                      component='a'
                      variant='subtitle1'
                      color='primary'
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {selectedEvent.extendedProps?.clientName || 'Not set'}
                    </Typography>
                  </Link>
                ) : (
                  selectedEvent.extendedProps?.clientName || 'Not set'
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' mb={2}>
              <LocationOn color='primary' sx={{ mr: 1 }} />
              <Typography variant='subtitle1' component='div'>
                Location: {selectedEvent.extendedProps?.location || 'Not set'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Chip
              label={selectedEvent.extendedProps?.type || 'Not set'}
              color='primary'
              variant='outlined'
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display='flex' alignItems='flex-start'>
              <Notes color='primary' sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant='body1' component='div'>
                <Box fontWeight='fontWeightMedium' display='inline'>
                  Notes:
                </Box>{' '}
                {selectedEvent.extendedProps?.notes || 'Not set'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
        <Button
          onClick={handleCancel}
          color='error'
          variant='contained'
          disabled={isCancelling || selectedEvent.extendedProps?.status === 'cancelled'}
          startIcon={<Cancel />}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewAppointmentModal
