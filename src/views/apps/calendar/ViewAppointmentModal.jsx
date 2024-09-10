import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { toast } from 'react-toastify'

import { cancelAppointment } from '@/app/actions/appointments'

const ViewAppointmentModal = ({ open, handleClose, selectedEvent, onAppointmentCancelled }) => {
  const { getToken } = useAuth()
  const [isCancelling, setIsCancelling] = useState(false)

  if (!selectedEvent) {
    return null
  }

  const handleCancel = async () => {
    setIsCancelling(true)

    try {
      const token = await getToken({ template: 'supabase' })

      await cancelAppointment(selectedEvent.id, token)
      onAppointmentCancelled(selectedEvent.id)
      toast.success('Appointment successfully cancelled')
      handleClose()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Failed to cancel appointment. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>View Appointment</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h6'>{selectedEvent.title || 'Untitled'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body1'>
              Start: {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : 'Not set'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body1'>
              End: {selectedEvent.end ? new Date(selectedEvent.end).toLocaleString() : 'Not set'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Client: {selectedEvent.extendedProps?.clientName || 'Not set'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Location: {selectedEvent.extendedProps?.location || 'Not set'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Type: {selectedEvent.extendedProps?.type || 'Not set'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Notes: {selectedEvent.extendedProps?.notes || 'Not set'}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
        <Button
          onClick={handleCancel}
          color='secondary'
          variant='contained'
          disabled={isCancelling || selectedEvent.extendedProps?.status === 'cancelled'}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewAppointmentModal
