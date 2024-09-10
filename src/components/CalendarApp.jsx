'use client'

// MUI Imports
import { useEffect, useState, useCallback } from 'react'

import Card from '@mui/material/Card'
import { useAuth } from '@clerk/nextjs'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// Server Action Import
import { getAppointments } from '@/app/actions/appointments'

// Calendar Wrapper Import
import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'

const CalendarApp = ({ addEventModalOpen, handleAddEventModalToggle }) => {
  const { getToken, userId } = useAuth()
  const [events, setEvents] = useState([])
  const [visibleDateRange, setVisibleDateRange] = useState({ start: null, end: null })

  const fetchEvents = useCallback(
    async (start, end) => {
      try {
        const token = await getToken({ template: 'supabase' })
        const appointmentEvents = await getAppointments(userId, token, start, end)

        console.log('Fetched events:', appointmentEvents)

        // Filter out cancelled appointments
        const filteredEvents = appointmentEvents.filter(event => event.extendedProps.status !== 'cancelled')

        setEvents(filteredEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    },
    [getToken, userId]
  )

  const refreshEvents = useCallback(async () => {
    if (visibleDateRange.start && visibleDateRange.end) {
      await fetchEvents(visibleDateRange.start, visibleDateRange.end)
    }
  }, [fetchEvents, visibleDateRange])

  useEffect(() => {
    if (userId && visibleDateRange.start && visibleDateRange.end) {
      fetchEvents(visibleDateRange.start, visibleDateRange.end)
    }
  }, [userId, visibleDateRange, fetchEvents])

  const handleDatesSet = dateInfo => {
    const newStart = dateInfo.start.toISOString()
    const newEnd = dateInfo.end.toISOString()

    if (newStart !== visibleDateRange.start || newEnd !== visibleDateRange.end) {
      setVisibleDateRange({
        start: newStart,
        end: newEnd
      })
    }
  }

  const handleAppointmentCancelled = useCallback(cancelledAppointmentId => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== cancelledAppointmentId))
  }, [])

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper
          events={events}
          addEventModalOpen={addEventModalOpen}
          handleAddEventModalToggle={handleAddEventModalToggle}
          onDatesSet={handleDatesSet}
          onAppointmentCancelled={handleAppointmentCancelled}
          refreshEvents={refreshEvents}
        />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
