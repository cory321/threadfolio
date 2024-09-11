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
    async currentDate => {
      try {
        const token = await getToken({ template: 'supabase' })
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

        const startDate = prevMonth.toISOString()
        const endDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).toISOString()

        const appointmentEvents = await getAppointments(userId, token, startDate, endDate)

        setEvents(appointmentEvents)

        return appointmentEvents
      } catch (error) {
        console.error('Error fetching events:', error)

        return []
      }
    },
    [getToken, userId]
  )

  const handleDatesSet = useCallback(
    dateInfo => {
      const newStart = dateInfo.start.toISOString()
      const newEnd = dateInfo.end.toISOString()

      if (newStart !== visibleDateRange.start || newEnd !== visibleDateRange.end) {
        setVisibleDateRange({ start: newStart, end: newEnd })
        fetchEvents(dateInfo.start)
      }
    },
    [visibleDateRange, fetchEvents]
  )

  useEffect(() => {
    if (userId) {
      fetchEvents(new Date())
    }
  }, [userId, fetchEvents])

  const handleAddAppointment = useCallback(newAppointment => {
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newAppointment]

      return updatedEvents
    })
  }, [])

  const handleCancelAppointment = useCallback(cancelledAppointmentId => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== cancelledAppointmentId))
  }, [])

  const refreshEvents = useCallback(async () => {
    if (visibleDateRange.start && visibleDateRange.end) {
      await fetchEvents(visibleDateRange.start, visibleDateRange.end)
    }
  }, [fetchEvents, visibleDateRange])

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper
          events={events}
          onDatesSet={handleDatesSet}
          addEventModalOpen={addEventModalOpen}
          handleAddEventModalToggle={handleAddEventModalToggle}
          refreshEvents={refreshEvents}
          onAddAppointment={handleAddAppointment}
          onCancelAppointment={handleCancelAppointment}
        />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
