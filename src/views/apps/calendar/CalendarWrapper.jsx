'use client'

// React Imports
import { useReducer, useState, useEffect, useCallback } from 'react'

// MUI Imports
import { useMediaQuery } from '@mui/material'

// Reducer Imports
import AddAppointmentModal from '@views/apps/calendar/AddAppointmentModal'
import calendarReducer from '@reducers/calendarReducer'

// View Imports
import Calendar from '@views/apps/calendar/Calendar'
import ViewAppointmentModal from '@views/apps/calendar/ViewAppointmentModal'

// Calendar Colors Object
const calendarsColor = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const AppCalendar = ({
  events,
  addEventModalOpen,
  handleAddEventModalToggle,
  onDatesSet,
  mutateAppointments,
  onCancelAppointment
}) => {
  // States
  const [calendarApi, setCalendarApi] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [viewEventModalOpen, setViewEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

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
  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))

  // Remove handleAddEvent function since it's no longer needed

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
    setSelectedDate(info.start)
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

  return (
    <>
      <div className='p-5 pbe-0 flex-grow overflow-visible bg-backgroundPaper'>
        <Calendar
          events={events}
          mdAbove={mdAbove}
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

export default AppCalendar
