'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party imports
import 'bootstrap-icons/font/bootstrap-icons.css'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// Vars
const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    description: ''
  }
}

const Calendar = props => {
  // Props
  const {
    calendars,
    calendarApi,
    setCalendarApi,
    calendarsColor,
    handleSelectEvent,
    handleUpdateEvent,
    handleAddEventModalToggle, // Changed from handleAddEventSidebarToggle
    handleLeftSidebarToggle
  } = props

  // Refs
  const calendarRef = useRef()

  // Hooks
  const theme = useTheme()

  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])

  // calendarOptions(Props)
  const calendarOptions = {
    events: calendars.events,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, today, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
      }
    },

    /*
          Enable dragging and resizing event
          ? Docs: https://fullcalendar.io/docs/editable
        */
    editable: true,

    /*
          Enable resizing event from start
          ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
        */
    eventResizableFromStart: true,

    /*
          Automatically scroll the scroll-containers during event drag-and-drop and date selecting
          ? Docs: https://fullcalendar.io/docs/dragScroll
        */
    dragScroll: true,

    /*
          Max number of events within a given day
          ? Docs: https://fullcalendar.io/docs/dayMaxEvents
        */
    dayMaxEvents: 2,

    /*
          Determines if day names and week names are clickable
          ? Docs: https://fullcalendar.io/docs/navLinks
        */
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `event-bg-${colorName}`
      ]
    },
    eventClick({ event: clickedEvent, jsEvent }) {
      jsEvent.preventDefault()
      handleSelectEvent(clickedEvent)
      handleAddEventModalToggle() // Changed from handleAddEventSidebarToggle

      if (clickedEvent.url) {
        // Open the URL in a new tab
        window.open(clickedEvent.url, '_blank')
      }

      //* Only grab required field otherwise it goes in infinity loop
      //! Always grab all fields rendered by form (even if it get `undefined`)
      // event.value = grabEventDataFromEventApi(clickedEvent)
      // isAddNewEventSidebarActive.value = true
    },
    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click() {
          handleLeftSidebarToggle()
        }
      },
      today: {
        text: 'today',
        click() {
          calendarApi.today()
        }
      }
    },
    dateClick(info) {
      const ev = { ...blankEvent }

      ev.start = info.date
      ev.end = info.date
      ev.allDay = true
      handleSelectEvent(ev)
      handleAddEventModalToggle() // Changed from handleAddEventSidebarToggle
    },

    /*
          Handle event drop (Also include dragged event)
          ? Docs: https://fullcalendar.io/docs/eventDrop
          ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
        */
    eventDrop({ event: droppedEvent }) {
      handleUpdateEvent(droppedEvent)
    },

    /*
          Handle event resize
          ? Docs: https://fullcalendar.io/docs/eventResize
        */
    eventResize({ event: resizedEvent }) {
      handleUpdateEvent(resizedEvent)
    },
    ref: calendarRef,
    direction: theme.direction
  }

  // @ts-ignore
  return <FullCalendar {...calendarOptions} />
}

export default Calendar
