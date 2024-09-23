import React, { useState } from 'react'

import Link from 'next/link'

import { Card, CardHeader, CardContent, Typography, Button, Box } from '@mui/material'

import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'

import AppointmentList from './AppointmentList'

const UpcomingClientAppointments = ({ appointments, clientName, clientId, showCancelled, onAddAppointment }) => {
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)

  const handleOpenAddAppointmentModal = () => {
    setIsAddAppointmentModalOpen(true)
  }

  const handleCloseAddAppointmentModal = () => {
    setIsAddAppointmentModalOpen(false)
  }

  const filteredAppointments = showCancelled
    ? appointments
    : appointments.filter(app => app.extendedProps.status !== 'cancelled')

  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardHeader title='Upcoming Appointments' />
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <Box display='flex' flexDirection='column' alignItems='center' mt={2}>
              <Typography variant='body1' color='textSecondary'>
                {clientName} has no upcoming appointments scheduled
              </Typography>
              {/* Use a button to open the modal instead of a Link */}
              <Button variant='text' color='primary' onClick={handleOpenAddAppointmentModal}>
                Schedule an Appointment
              </Button>
            </Box>
          ) : (
            <AppointmentList appointments={filteredAppointments} />
          )}
        </CardContent>
      </Card>
      {/* Include the AddAppointmentModal and pass the client information */}
      <AddAppointmentModal
        addEventModalOpen={isAddAppointmentModalOpen}
        handleAddEventModalToggle={handleCloseAddAppointmentModal}
        client={{ id: clientId, full_name: clientName }}
        onAddAppointment={onAddAppointment} // Pass the handler down
      />
    </>
  )
}

export default UpcomingClientAppointments
