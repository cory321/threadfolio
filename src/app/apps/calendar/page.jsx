// MUI Imports
import Card from '@mui/material/Card'

import { events } from './events.js'

// Component Imports
import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// async function fetchEvents() {
//   // Vars
//   // const res = await fetch(`${process.env.API_URL}/apps/calendar-events`)

//   if (!res.ok) {
//     throw new Error('Failed to fetch data')
//   }

//   return res.json()
// }

const CalendarApp = async () => {
  // Vars
  // const res = (await fetchEvents()) || []

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper events={events} />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
