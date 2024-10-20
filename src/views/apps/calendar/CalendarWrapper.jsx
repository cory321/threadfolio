'use client'

// React Imports
import { useReducer, useState, useEffect, useCallback } from 'react'

// MUI Imports
import { useMediaQuery, useTheme } from '@mui/material'

// Reducer Imports
import { startOfMonth, endOfMonth } from 'date-fns'

import AddAppointmentModal from '@views/apps/calendar/AddAppointmentModal'
import calendarReducer from '@reducers/calendarReducer'

// View Imports
import Calendar from '@views/apps/calendar/Calendar'
import MobileCalendar from '@views/apps/calendar/MobileCalendar' // Import the MobileCalendar
import ViewAppointmentModal from '@views/apps/calendar/ViewAppointmentModal'

// Calendar Colors Object
const calendarsColor = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const CalendarWrapper = ({
  events,
  onDatesSet,
  addEventModalOpen,
  handleAddEventModalToggle,
  mutateAppointments,
  onCancelAppointment,
  onMobileMonthChange
}) => {
  // States
  const [calendarApi, setCalendarApi] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewEventModalOpen, setViewEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [visibleDateRange, setVisibleDateRange] = useState({ start: null, end: null })

  // Vars
  const initialState = {
    events: events,
    selectedEvent: null,
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
  }

  useEffect(() => {
    dispatch({ type: 'init', events })
  }, [events])

  // Hooks
  const [calendars, dispatch] = useReducer(calendarReducer, initialState)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Handler for month changes in mobile calendar
  const handleMonthChange = useCallback(
    date => {
      if (onMobileMonthChange) {
        onMobileMonthChange(date)
      }
    },
    [onMobileMonthChange]
  )

  // Update event handler (if needed)
  const handleUpdateEvent = async event => {
    // Implement event update logic here
  }

  // Delete event handler (if needed)
  const handleDeleteEvent = async eventId => {
    // Implement event deletion logic here
  }

  // Toggle view event modal
  const handleViewEventModalToggle = () => {
    setViewEventModalOpen(!viewEventModalOpen)
  }

  // Select event handler
  const handleSelectEvent = info => {
    setSelectedDate(info.start || new Date(info.startStr))
    setSelectedEvent(info)
    dispatch({ type: 'selected_event', event: info })
    handleViewEventModalToggle()
  }

  // Appointment cancelled handler
  const handleAppointmentCancelled = useCallback(
    cancelledAppointmentId => {
      dispatch({ type: 'deleted', eventId: cancelledAppointmentId })
      onCancelAppointment(cancelledAppointmentId)
    },
    [onCancelAppointment]
  )

  // Pass `visibleDateRange` up to `CalendarApp` or manage data fetching here
  useEffect(() => {
    // You can choose to manage data fetching here or pass it up
    // For now, we assume you pass it up via a prop function
    if (onDatesSet && visibleDateRange.start && visibleDateRange.end) {
      onDatesSet({ start: new Date(visibleDateRange.start), end: new Date(visibleDateRange.end) })
    }
  }, [visibleDateRange, onDatesSet])

  return (
    <>
      <div className='p-5 pbe-0 flex-grow overflow-visible bg-backgroundPaper'>
        {isMobile ? (
          <MobileCalendar
            events={events}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleSelectEvent={handleSelectEvent}
            onMonthChange={handleMonthChange}
          />
        ) : (
          <Calendar
            events={events}
            mdAbove={!isMobile}
            calendars={calendars}
            calendarApi={calendarApi}
            setCalendarApi={setCalendarApi}
            calendarsColor={calendarsColor}
            handleUpdateEvent={handleUpdateEvent}
            handleSelectEvent={handleSelectEvent}
            handleAddEventModalToggle={handleAddEventModalToggle}
            handleViewEventModalToggle={handleViewEventModalToggle}
            setSelectedDate={setSelectedDate}
            onDatesSet={onDatesSet}
          />
        )}
      </div>
      <AddAppointmentModal
        addEventModalOpen={addEventModalOpen}
        handleAddEventModalToggle={handleAddEventModalToggle}
        selectedDate={selectedDate}
        mutateAppointments={mutateAppointments}
      />
      <ViewAppointmentModal
        open={viewEventModalOpen}
        handleClose={handleViewEventModalToggle}
        selectedEvent={selectedEvent}
        onAppointmentCancelled={handleAppointmentCancelled}
        refreshEvents={mutateAppointments}
      />
    </>
  )
}

export default CalendarWrapper
