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
    handleViewEventModalToggle,
    setSelectedDate // Add this line
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
      start: 'prev,next,title',
      end: 'today dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
      }
    },
    editable: false,
    eventResizableFromStart: false,
    dragScroll: true,
    dayMaxEvents: false,
    navLinks: false,
    selectable: false,
    unselectAuto: false,
    eventClassNames: arg => {
      const colorName = calendarsColor[arg.event.extendedProps.calendar]

      return [`event-bg-${colorName}`]
    },
    eventClick: info => {
      handleSelectEvent(info.event)
      handleViewEventModalToggle()
    },
    dateClick: info => {
      if (!info.dayEl.classList.contains('fc-event')) {
        handleAddEventModalToggle()
        setSelectedDate(info.date)
      }
    },
    moreLinkClick: info => {
      console.log('More link clicked', info)
    },
    customButtons: {
      today: {
        text: 'today',
        click() {
          calendarApi.today()
        }
      }
    },
    ref: calendarRef,
    direction: theme.direction,
    eventContent: info => {
      const timeFormat = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })

      const startTime = timeFormat.format(info.event.start)
      const endTime = timeFormat.format(info.event.end)
      const title = info.event.title.split(' - ')
      const appointmentType = title[0]
      const clientName = title[1]

      return {
        html: `
          <div class="fc-event-main-frame">
          <div class="fc-event-title-container">
              <div class="fc-event-title fc-event-title-client">${clientName}</div>
            </div>
            <div class="fc-event-time">${startTime} - ${endTime}</div>
          </div>
        `
      }
    }
  }

  // @ts-ignore
  return <FullCalendar {...calendarOptions} />
}

export default Calendar
