'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'

// Component Imports
import { useAuth } from '@clerk/nextjs'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// Server Action Import
import { getAppointmentsAction } from '@actions/appointments'

// Calendar Wrapper Import
import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'

const CalendarApp = () => {
  // Get the user and token from Clerk's useAuth hook
  const { getToken, userId } = useAuth()

  // State to store the events
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch the token
        const token = await getToken({ template: 'supabase' })

        // Fetch and transform appointment data using the server action
        const appointmentEvents = await getAppointmentsAction(userId, token)

        // Update the events state
        setEvents(appointmentEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    if (userId) {
      fetchEvents()
    }
  }, [getToken, userId])

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper events={events} />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
