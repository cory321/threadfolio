import React from 'react'

import Link from 'next/link'

import { Card, CardHeader, CardContent, Typography, Button, Box } from '@mui/material'

import AppointmentList from './AppointmentList'

const UpcomingClientAppointments = ({ appointments, clientName }) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title='Upcoming Appointments' />
      <CardContent>
        {appointments.length === 0 ? (
          <Box display='flex' flexDirection='column' alignItems='center' mt={2}>
            <Typography variant='body1' color='textSecondary'>
              {clientName} has no upcoming appointments scheduled
            </Typography>
            <Link href='/appointments' passHref>
              <Button variant='text' color='primary'>
                Schedule an Appointment
              </Button>
            </Link>
          </Box>
        ) : (
          <AppointmentList appointments={appointments} />
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingClientAppointments
