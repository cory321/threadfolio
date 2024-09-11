'use client'

// MUI Imports
import { useEffect, useState, useCallback, useMemo } from 'react'

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
  const [events, setEvents] = useState({})
  const [visibleDateRange, setVisibleDateRange] = useState({ start: null, end: null })

  const fetchEvents = useCallback(
    async (start, end) => {
      try {
        const token = await getToken({ template: 'supabase' })
        const appointmentEvents = await getAppointments(userId, token, start, end)

        return appointmentEvents
      } catch (error) {
        console.error('Error fetching events:', error)

        return []
      }
    },
    [getToken, userId]
  )

  const prefetchEvents = useCallback(
    async currentDate => {
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

      const startDate = prevMonth.toISOString()
      const endDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).toISOString()

      const fetchedEvents = await fetchEvents(startDate, endDate)

      setEvents(fetchedEvents)
    },
    [fetchEvents]
  )

  const handleDatesSet = useCallback(
    dateInfo => {
      const newStart = dateInfo.start.toISOString()
      const newEnd = dateInfo.end.toISOString()

      if (newStart !== visibleDateRange.start || newEnd !== visibleDateRange.end) {
        setVisibleDateRange({ start: newStart, end: newEnd })
        prefetchEvents(dateInfo.start)
      }
    },
    [visibleDateRange, prefetchEvents]
  )

  const refreshEvents = useCallback(() => {
    if (visibleDateRange.start) {
      prefetchEvents(new Date(visibleDateRange.start))
    }
  }, [prefetchEvents, visibleDateRange])

  useEffect(() => {
    if (userId && visibleDateRange.start) {
      prefetchEvents(new Date(visibleDateRange.start))
    }
  }, [userId, visibleDateRange, prefetchEvents])

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper
          events={events}
          onDatesSet={handleDatesSet}
          addEventModalOpen={addEventModalOpen}
          handleAddEventModalToggle={handleAddEventModalToggle}
          refreshEvents={refreshEvents}
        />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
