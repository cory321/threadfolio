import React, { useEffect, useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Typography, Card, CardContent } from '@mui/material'

import { getClientAppointments } from '@/app/actions/appointments'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UpcomingClientAppointments from './UpcomingClientAppointments'
import AppointmentHistory from './AppointmentHistory'

const ClientAppointments = ({ clientId }) => {
  const { getToken, userId } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('ClientAppointments useEffect triggered')
    console.log('clientId:', clientId)
    console.log('userId:', userId)

    const fetchAppointments = async () => {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })

        console.log('Token obtained:', token ? 'Yes' : 'No')
        const appointmentEvents = await getClientAppointments(userId, clientId, token)

        console.log('Appointments fetched:', appointmentEvents)

        setAppointments(appointmentEvents)
        setError(null)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        setError('Failed to load appointments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId && clientId) {
      fetchAppointments()
    } else {
      console.log('Missing userId or clientId')
      setIsLoading(false)
    }
  }, [getToken, userId, clientId])

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

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const upcomingAppointments = appointments.filter(appointment => new Date(appointment.start) >= today)
  const pastAppointments = appointments.filter(appointment => new Date(appointment.start) < today)

  return (
    <Box>
      <UpcomingClientAppointments appointments={upcomingAppointments} />
      <AppointmentHistory appointments={pastAppointments} />
    </Box>
  )
}

export default ClientAppointments
