export default function calendarReducer(calendars, action) {
  switch (action.type) {
    case 'init': {
      return {
        ...calendars,
        events: action.events,
        selectedEvent: null,
        selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
      }
    }

    case 'added': {
      return {
        ...calendars,
        events: [...calendars.events, action.event]
      }
    }

    case 'updated': {
      const events = calendars.events.map(event => {
        if (event.id === action.event?.id) {
          return action.event
        } else {
          return event
        }
      })

      return { ...calendars, events }
    }

    case 'deleted': {
      const events = calendars.events.filter(event => event.id !== action.eventId)

      return { ...calendars, events }
    }

    case 'selected_event': {
      return { ...calendars, selectedEvent: action.event }
    }

    case 'selected_calendars': {
      const selectedCalendars = [...calendars.selectedCalendars]
      const index = selectedCalendars.indexOf(action.calendar)

      if (index !== -1) {
        selectedCalendars.splice(index, 1)
      } else {
        selectedCalendars.push(action.calendar)
      }

      const selectedEvents = calendars.events.filter(event => selectedCalendars.includes(event.extendedProps.calendar))

      return { ...calendars, events: selectedEvents, selectedCalendars }
    }

    case 'selected_all_calendars': {
      let selectedCalendars = ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
      let events = calendars.events

      if (!action.view_all) {
        selectedCalendars = []
        events = []
      }

      return { ...calendars, events, selectedCalendars }
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
