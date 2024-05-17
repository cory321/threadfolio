'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'

// Component Imports
import { useAuth } from '@clerk/nextjs'

import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// Server Action Import
import { getAppointmentsAction } from '@actions/appointments'

// Clerk Import

const CalendarApp = () => {
  // Get the token from Clerk's useAuth hook
  const { getToken } = useAuth()

  // State to store the events
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch the token
        const token = await getToken({ template: 'supabase' })

        // Fetch and transform appointment data using the server action
        const appointmentEvents = await getAppointmentsAction(token)

        // Update the events state
        setEvents(appointmentEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [getToken])

  const fake_events = [
    {
      id: '5a2fedb5-c8c9-47ee-b4d0-22974039d147',
      title: 'Order Pickup',
      start: '2024-05-22T23:30:00.000Z',
      end: '2024-05-23T03:00:00.000Z',
      allDay: false,
      extendedProps: {
        location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
        status: 'scheduled',
        type: 'order_pickup',
        sendEmail: false,
        sendSms: false,
        notes: ''
      }
    },
    {
      id: 'ec02a1a5-baf5-4a08-a140-982a5832ba01',
      title: 'General Appointment',
      start: '2024-05-18T07:49:30.000Z',
      end: '2024-05-18T07:49:30.000Z',
      allDay: false,
      extendedProps: {
        location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
        status: 'scheduled',
        type: 'general',
        sendEmail: false,
        sendSms: false,
        notes: ''
      }
    }
  ]

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper events={events} />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
