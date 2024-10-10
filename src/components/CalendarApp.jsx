'use client'

// MUI Imports
import { useCallback, useState } from 'react'

import Card from '@mui/material/Card'
import useSWR from 'swr'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// Server Action Import
import { getAppointments } from '@/app/actions/appointments'

// Calendar Wrapper Import
import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'

const fetchAppointments = async (startDate, endDate) => {
  try {
    const appointmentEvents = await getAppointments(startDate, endDate)

    return appointmentEvents
  } catch (error) {
    console.error('Error fetching events:', error)

    return []
  }
}

const CalendarApp = ({ addEventModalOpen, handleAddEventModalToggle }) => {
  const [visibleDateRange, setVisibleDateRange] = useState({ start: null, end: null })

  const { data: events = [], mutate: mutateAppointments } = useSWR(
    visibleDateRange.start && visibleDateRange.end
      ? ['appointments', visibleDateRange.start, visibleDateRange.end]
      : null,
    () => fetchAppointments(visibleDateRange.start, visibleDateRange.end)
  )

  const handleDatesSet = useCallback(
    dateInfo => {
      const newStart = dateInfo.start.toISOString()
      const newEnd = dateInfo.end.toISOString()

      if (newStart !== visibleDateRange.start || newEnd !== visibleDateRange.end) {
        setVisibleDateRange({ start: newStart, end: newEnd })
      }
    },
    [visibleDateRange]
  )

  const handleCancelAppointment = useCallback(() => {
    mutateAppointments() // Re-fetch appointments after cancellation
  }, [mutateAppointments])

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper
          events={events}
          onDatesSet={handleDatesSet}
          addEventModalOpen={addEventModalOpen}
          handleAddEventModalToggle={handleAddEventModalToggle}
          mutateAppointments={mutateAppointments}
          onCancelAppointment={handleCancelAppointment}
        />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
