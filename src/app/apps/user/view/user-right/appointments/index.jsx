import React, { useEffect, useState, useCallback } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Typography, Card, CardContent, Switch, FormControlLabel } from '@mui/material'

import { getClientAppointments } from '@/app/actions/appointments'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UpcomingClientAppointments from './UpcomingClientAppointments'
import AppointmentHistory from './AppointmentHistory'

const ClientAppointments = ({ clientId, clientName }) => {
  const { getToken, userId } = useAuth()
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCancelled, setShowCancelled] = useState(false)

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })
        const { appointments } = await getClientAppointments(userId, clientId, token, 1, 10, false)

        setUpcomingAppointments(appointments)
        setError(null)
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error)
        setError('Failed to load upcoming appointments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId && clientId) {
      fetchUpcomingAppointments()
    } else {
      console.log('Missing userId or clientId')
      setIsLoading(false)
    }
  }, [getToken, userId, clientId])

  const handleToggleShowCancelled = () => {
    setShowCancelled(!showCancelled)
  }

  // Add this function to handle new appointments
  const handleAddAppointment = newAppointment => {
    setUpcomingAppointments(prevAppointments => {
      const updatedAppointments = [...prevAppointments, newAppointment]

      // Sort appointments by start time to maintain order
      return updatedAppointments.sort((a, b) => new Date(a.start) - new Date(b.start))
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color='error'>{error}</Typography>
        </CardContent>
      </Card>
    )
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
        onAddAppointment={handleAddAppointment} // Pass the handler down
      />
      <AppointmentHistory clientId={clientId} userId={userId} showCancelled={showCancelled} />
    </Box>
  )
}

export default ClientAppointments
