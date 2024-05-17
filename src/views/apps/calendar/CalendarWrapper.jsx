'use client'

// React Imports
import { useReducer, useState } from 'react'

// MUI Imports
import { useMediaQuery, Button } from '@mui/material'

// Reducer Imports
import AddAppointmentModal from '@views/apps/calendar/AddAppointmentModal'
import calendarReducer from '@reducers/calendarReducer'

// View Imports
import Calendar from '@views/apps/calendar/Calendar'
import SidebarLeft from '@views/apps/calendar/SidebarLeft'

// CalendarColors Object
const calendarsColor = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const AppCalendar = ({ events }) => {
  // States
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)

  // Vars
  const initialState = {
    events: events,
    selectedEvent: null,
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
  }

  // Hooks
  const [calendars, dispatch] = useReducer(calendarReducer, initialState)
  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleAddEventModalToggle = () => setAddEventModalOpen(!addEventModalOpen)

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

  // Dispatch Select Event Action
  const handleSelectEvent = event => {
    dispatch({ type: 'selected_event', event: event })
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
    const defaultAppointment = {
      clientId: '71cd77e6-34b5-43ee-994a-aa5d471a00e5',
      userId: 'yourUserId', // Replace with the actual user ID
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes later
      location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
      status: 'scheduled',
      type: 'initial_consultation',
      sendEmail: false,
      sendSms: false,
      notes: ''
    }

    try {
      const token = 'yourAuthToken' // Replace with the actual token

      const data = await addAppointmentAction(
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
      <SidebarLeft
        mdAbove={mdAbove}
        leftSidebarOpen={leftSidebarOpen}
        calendars={calendars}
        calendarApi={calendarApi}
        calendarsColor={calendarsColor}
        handleSelectEvent={handleSelectEvent}
        handleAllCalendars={handleAllCalendars}
        handleCalendarsUpdate={handleCalendarsUpdate}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventModalToggle={handleAddEventModalToggle}
      />
      <div className='p-5 pbe-0 flex-grow overflow-visible bg-backgroundPaper'>
        <Calendar
          mdAbove={mdAbove}
          calendars={calendars}
          calendarApi={calendarApi}
          setCalendarApi={setCalendarApi}
          calendarsColor={calendarsColor}
          handleUpdateEvent={handleUpdateEvent}
          handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventModalToggle={handleAddEventModalToggle}
        />
        <Button variant='contained' color='primary' onClick={handleAddAppointmentClick}>
          Add Default Appointment
        </Button>
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
      />
    </>
  )
}

export default AppCalendar
