import React, { useState } from 'react'

import Link from 'next/link'

import { Card, CardHeader, CardContent, Typography, Button, Box } from '@mui/material'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'

import AppointmentList from './AppointmentList'

const UpcomingClientAppointments = ({ appointments, clientName, clientId, showCancelled, mutateAppointments }) => {
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
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
              <Typography variant='h5'>Upcoming Appointments</Typography>
              <Button variant='outlined' color='primary' onClick={handleOpenAddAppointmentModal}>
                Schedule an Appointment
              </Button>
            </Box>
          }
        />
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <Box display='flex' flexDirection='column' alignItems='center' mt={1} p={10}>
              <CalendarTodayIcon color='action' sx={{ fontSize: 48, mb: 5 }} />
              <Typography variant='body1' color='textSecondary' align='center' gutterBottom>
                {clientName} has no upcoming appointments scheduled
              </Typography>
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
        mutateAppointments={mutateAppointments}
      />
    </>
  )
}

export default UpcomingClientAppointments
