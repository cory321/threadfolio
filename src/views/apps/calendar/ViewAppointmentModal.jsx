// src/views/apps/calendar/ViewAppointmentModal.jsx
import React, { useState } from 'react'

import Link from 'next/link'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
    if (!date) return 'Not set'

    const formattedTime = new Date(date).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    })

    // Remove leading zero for hours, but keep it for 12:00
    return formattedTime.replace(/^0(?!0:00)/, '')
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth fullScreen={isMobile}>
      {/* Dialog Title with Close Button */}
      <DialogTitle>
        <Typography variant='h5' component='h2'>
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
          <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
          {selectedEvent.extendedProps?.clientId ? (
            <Link href={`/clients/${selectedEvent.extendedProps.clientId}`} passHref>
              <Typography
                component='a'
                variant='h5'
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {selectedEvent.extendedProps?.clientName || 'Client not found'}
              </Typography>
            </Link>
          ) : (
            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
              {selectedEvent.extendedProps?.clientName || 'Client not found'}
            </Typography>
          )}
        </Box>

        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
            {formatDate(selectedEvent.start)}
          </Typography>
        </Box>

        {/* Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
            {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 8 }}>
          <LocationOnIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
            {selectedEvent.extendedProps?.location || 'Not set'}
          </Typography>
        </Box>

        {/* Notes */}
        {selectedEvent.extendedProps?.notes && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <NotesIcon sx={{ mr: 2, fontSize: 20 }} />
            <Box>
              <Typography variant='body1'>{selectedEvent.extendedProps?.notes}</Typography>
            </Box>
          </Box>
        )}
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
