'use client'

// React Imports
import { useCallback, useState, useEffect } from 'react'

// MUI Imports
import { useMediaQuery, useTheme } from '@mui/material'

import Card from '@mui/material/Card'

// SWR Import
import useSWR from 'swr'

// Date Functions
import { startOfMonth, endOfMonth } from 'date-fns'

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Initialize visible date range for mobile users
  useEffect(() => {
    if (isMobile) {
      const currentDate = new Date()
      const start = startOfMonth(currentDate).toISOString()
      const end = endOfMonth(currentDate).toISOString()

      setVisibleDateRange({ start, end })
    }
  }, [isMobile])

  const { data: events = [], mutate: mutateAppointments } = useSWR(
    visibleDateRange.start && visibleDateRange.end
      ? ['appointments', visibleDateRange.start, visibleDateRange.end]
      : null,
    () => fetchAppointments(visibleDateRange.start, visibleDateRange.end),
    { revalidateOnFocus: false }
  )

  const handleDatesSet = useCallback(
    dateInfo => {
      if (isMobile) return // Do nothing on mobile
      const newStart = dateInfo.start.toISOString()
      const newEnd = dateInfo.end.toISOString()

      if (newStart !== visibleDateRange.start || newEnd !== visibleDateRange.end) {
        setVisibleDateRange({ start: newStart, end: newEnd })
      }
    },
    [visibleDateRange, isMobile]
  )

  // Reintroduce handleCancelAppointment function
  const handleCancelAppointment = useCallback(() => {
    mutateAppointments() // Re-fetch appointments after cancellation
  }, [mutateAppointments])

  // Update visibleDateRange when month changes on mobile
  const handleMobileMonthChange = useCallback(
    date => {
      const start = startOfMonth(date).toISOString()
      const end = endOfMonth(date).toISOString()

      setVisibleDateRange({ start, end })
    },
    [setVisibleDateRange]
  )

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
          onMobileMonthChange={handleMobileMonthChange} // Pass the handler
        />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
