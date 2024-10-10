// src/views/apps/calendar/ViewAppointmentModal.jsx
import React, { useState } from 'react'

import Link from 'next/link'

import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Box, IconButton } from '@mui/material'
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Notes as NotesIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'

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
      ? new Date(date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Not set'
  }

  const formatTime = date => {
    return date
      ? new Date(date).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Not set'
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      {/* Dialog Title with Close Button */}
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', position: 'relative', pl: 3, py: 2 }}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>
          {(selectedEvent.title && selectedEvent.title.split('-')[0].trim()) || 'Untitled Appointment'}
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent dividers sx={{ p: 4, mb: 4 }}>
        {/* Client Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          {selectedEvent.extendedProps?.clientId ? (
            <Link href={`/clients/${selectedEvent.extendedProps.clientId}`} passHref>
              <Typography
                component='a'
                variant='h6'
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {selectedEvent.extendedProps?.clientName || 'Not set'}
              </Typography>
            </Link>
          ) : (
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              {selectedEvent.extendedProps?.clientName || 'Not set'}
            </Typography>
          )}
        </Box>

        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Typography variant='body1'>{formatDate(selectedEvent.start)}</Typography>
        </Box>

        {/* Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Typography variant='body1'>
            {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOnIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Typography variant='body1'>{selectedEvent.extendedProps?.location || 'Not set'}</Typography>
        </Box>

        {/* Notes */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <NotesIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28, mt: 0.5 }} />
          <Box>
            <Typography variant='body1' sx={{ fontWeight: 'medium', mb: 0.5 }}>
              Notes:
            </Typography>
            <Typography variant='body1'>{selectedEvent.extendedProps?.notes || 'Not set'}</Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant='outlined'
          color='primary'
          sx={{ mx: 1 }}

          // Add onClick handler for rescheduling as needed
        >
          Reschedule
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={handleCancel}
          disabled={isCancelling || selectedEvent.extendedProps?.status === 'cancelled'}
          startIcon={<CancelIcon />}
          sx={{ mx: 1 }}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewAppointmentModal
