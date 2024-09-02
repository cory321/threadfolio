import React from 'react'

import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material'

import AppointmentList from './AppointmentList'

const AppointmentHistory = ({ appointments }) => {
  return (
    <Card>
      <CardHeader title='Appointment History' />
      <CardContent>
        {appointments.length === 0 ? (
          <Box display='flex' flexDirection='column' alignItems='center' mt={2}>
            <Typography variant='body1' color='textSecondary'>
              This client has no past appointments
            </Typography>
          </Box>
        ) : (
          <AppointmentList appointments={appointments} isHistory={true} />
        )}
      </CardContent>
    </Card>
  )
}

export default AppointmentHistory
