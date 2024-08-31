import React from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'

const ViewAppointmentModal = ({ open, handleClose, selectedEvent }) => {
  if (!selectedEvent) {
    return null
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
      </DialogActions>
    </Dialog>
  )
}

export default ViewAppointmentModal
