'use client'

// React Imports
import { useReducer, useState, useEffect } from 'react'

// MUI Imports
import { useMediaQuery, Button } from '@mui/material'

// Reducer Imports
import AddAppointmentModal from '@views/apps/calendar/AddAppointmentModal'
import calendarReducer from '@reducers/calendarReducer'

// View Imports
import Calendar from '@views/apps/calendar/Calendar'
import ViewAppointmentModal from '@views/apps/calendar/ViewAppointmentModal'

// CalendarColors Object
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
  onAppointmentCancelled,
  refreshEvents
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

  // useEffect(() => {
  //   console.log('Events state updated:', calendars.events)
  // }, [calendars.events])

  // Hooks
  const [calendars, dispatch] = useReducer(calendarReducer, initialState)
  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))

  // Add event handler
  const handleAddEvent = async event => {
    // Add event API
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/calendar-events`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Dispatch Add Event Action
        dispatch({ type: 'added', event: data.event })
      })
  }

  // Update event handler
  const handleUpdateEvent = async event => {
    // Update event API
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/calendar-events`, {
      method: 'PUT',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(() => {
        // Dispatch Update Event Action
        dispatch({ type: 'updated', event })
      })
  }

  // Delete event handler
  const handleDeleteEvent = async eventId => {
    // Delete event API
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/calendar-events`, {
      method: 'DELETE',
      body: JSON.stringify({ id: eventId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(() => {
        // Dispatch Delete Event Action
        dispatch({ type: 'deleted', eventId })
      })
  }

  // Add this function
  const handleViewEventModalToggle = () => {
    setViewEventModalOpen(!viewEventModalOpen)
  }

  // Dispatch Select Event Action
  const handleSelectEvent = info => {
    setSelectedDate(info.start)
    setSelectedEvent(info) // Set the selected event
    dispatch({ type: 'selected_event', event: info })
    handleViewEventModalToggle() // Open the view modal when an event is selected
  }

  // Dispatch Select Calendar Action
  const handleCalendarsUpdate = calendar => {
    dispatch({ type: 'selected_calendars', calendar })
  }

  const handleAllCalendars = view_all => {
    dispatch({ type: 'selected_all_calendars', view_all })
  }

  // Handle button click to add a default appointment
  const handleAddAppointmentClick = async () => {
    try {
      const data = await addAppointment(
        defaultAppointment.clientId,
        defaultAppointment.userId,
        defaultAppointment.appointmentDate,
        defaultAppointment.startTime,
        defaultAppointment.endTime,
        defaultAppointment.location,
        defaultAppointment.status,
        defaultAppointment.type,
        defaultAppointment.sendEmail,
        defaultAppointment.sendSms,
        defaultAppointment.notes,
        token
      )

      handleAddEvent(data)
    } catch (error) {
      console.error('Failed to add appointment:', error)
    }
  }

  return (
    <>
      <div className='p-5 pbe-0 flex-grow overflow-visible bg-backgroundPaper'>
        <Calendar
          events={events} // Make sure this prop is passed correctly
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
        calendars={calendars}
        calendarApi={calendarApi}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        addEventModalOpen={addEventModalOpen}
        handleAddEventModalToggle={handleAddEventModalToggle}
        handleSelectEvent={handleSelectEvent}
        dispatch={dispatch}
        selectedDate={selectedDate}
      />
      <ViewAppointmentModal
        open={viewEventModalOpen}
        handleClose={handleViewEventModalToggle}
        selectedEvent={selectedEvent}
        onAppointmentCancelled={onAppointmentCancelled}
        refreshEvents={refreshEvents}
      />
    </>
  )
}

export default AppCalendar
