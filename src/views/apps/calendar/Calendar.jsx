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
    dayMaxEventRows: true,
    navLinks: false,
    selectable: false,
    unselectAuto: false,
    dayCellContent: args => {
      return {
        html: `
          <div class="fc-daygrid-day-number">${args.dayNumberText}</div>
        `
      }
    },
    dayHeaderContent: args => {
      return {
        html: `<div class="fc-day-header">${args.text}</div>`
      }
    },
    eventClassNames({ event: calendarEvent }) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `event-bg-${colorName}`
      ]
    },
    eventClick: function (info) {
      handleSelectEvent(info.event)
      handleViewEventModalToggle()
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
            <div class="fc-event-time">${startTime} - ${endTime}</div>
            <div class="fc-event-title-container">
            <div class="fc-event-title fc-event-title-client">${clientName}</div>
            <div class="fc-event-title">${appointmentType}</div>
            </div>
          </div>
        `
      }
    },
    dayCellDidMount: arg => {
      const date = arg.date
      const cell = arg.el

      cell.addEventListener('click', e => {
        // Check if the clicked element or its parent is the "more events" link
        const moreLink = e.target.closest('.fc-daygrid-more-link')

        if (moreLink) {
          // Prevent the event from bubbling up to the cell
          e.stopPropagation()

          return // Exit the function early
        }

        if (!e.target.closest('.fc-event')) {
          handleAddEventModalToggle()
          setSelectedDate(date)
        }
      })

      // Add a separate listener for the "more events" link
      const moreLink = cell.querySelector('.fc-daygrid-more-link')

      if (moreLink) {
        moreLink.addEventListener('click', e => {
          // Prevent the event from bubbling up to the cell
          e.stopPropagation()

          // Here you can add custom behavior for the "more events" link if needed
        })
      }
    },
    dayCellContent: arg => {
      return {
        html: `
          <div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner">
            <div class="fc-daygrid-day-top">
              <a class="fc-daygrid-day-number">${arg.dayNumberText}</a>
            </div>
            <div class="fc-daygrid-day-events"></div>
            <div class="fc-daygrid-day-bg"></div>
          </div>
        `
      }
    }
  }

  useEffect(() => {
    const handleAddAppointmentClick = e => {
      if (e.target.classList.contains('add-appointment-btn')) {
        const date = new Date(e.target.dataset.date)

        handleAddEventModalToggle()
        setSelectedDate(date)
      }
    }

    document.addEventListener('click', handleAddAppointmentClick)

    return () => {
      document.removeEventListener('click', handleAddAppointmentClick)
    }
  }, [handleAddEventModalToggle, setSelectedDate])

  // @ts-ignore
  return <FullCalendar {...calendarOptions} />
}

export default Calendar
