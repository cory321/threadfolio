import React, { useEffect, useState } from 'react'

import useSWR from 'swr'

import { useAuth } from '@clerk/nextjs'
import { Box, Typography, Card, CardContent, Switch, FormControlLabel } from '@mui/material'

import { getClientAppointments } from '@/app/actions/appointments'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UpcomingClientAppointments from './UpcomingClientAppointments'
import AppointmentHistory from './AppointmentHistory'

const ClientAppointments = ({ clientId, clientName }) => {
  const { userId } = useAuth()
  const [showCancelled, setShowCancelled] = useState(false)

  const fetchClientAppointments = async () => {
    try {
      const { appointments } = await getClientAppointments(userId, clientId, 1, 10, false)

      return appointments
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
      throw error
    }
  }

  const {
    data: upcomingAppointments = [],
    error,
    mutate: mutateClientAppointments
  } = useSWR(userId && clientId ? ['clientAppointments', userId, clientId] : null, fetchClientAppointments)

  const handleToggleShowCancelled = () => {
    setShowCancelled(!showCancelled)
  }

  if (!upcomingAppointments) {
    return <LoadingSpinner />
  }

  if (error) {
    return <Typography color='error'>Failed to load appointments</Typography>
  }

  return (
    <Box>
      <FormControlLabel
        control={<Switch checked={showCancelled} onChange={handleToggleShowCancelled} />}
        label='Show Cancelled Appointments'
        sx={{ mb: 2 }}
      />
      <UpcomingClientAppointments
        appointments={upcomingAppointments}
        clientName={clientName}
        clientId={clientId}
        showCancelled={showCancelled}
        mutateAppointments={mutateClientAppointments} // Pass mutate function
      />
      <AppointmentHistory clientId={clientId} userId={userId} showCancelled={showCancelled} />
    </Box>
  )
}

export default ClientAppointments
