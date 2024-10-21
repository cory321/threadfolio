'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'
import { LocalizationProvider, DateCalendar, PickersDay } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, isSameDay } from 'date-fns'

// MobileCalendar Component
const MobileCalendar = ({ events, selectedDate, setSelectedDate, handleSelectEvent, onMonthChange }) => {
  const [selectedEvents, setSelectedEvents] = useState([])

  useEffect(() => {
    if (selectedDate) {
      const eventsForSelectedDate = events.filter(event => isSameDay(new Date(event.start), selectedDate))

      setSelectedEvents(eventsForSelectedDate)
    } else {
      setSelectedEvents([])
    }
  }, [selectedDate, events])

  const handleMonthChange = date => {
    if (onMonthChange) {
      onMonthChange(date)
    }
  }

  // Custom Day component using sx and pseudo-element
  const EventDay = dayProps => {
    const { day, outsideCurrentMonth, ...other } = dayProps

    const hasEvents = events.some(event => isSameDay(new Date(event.start), day))

    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          position: 'relative',
          ...(hasEvents && {
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'primary.main'
            }
          })
        }}
      />
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        value={selectedDate}
        onChange={newDate => setSelectedDate(newDate)}
        onMonthChange={handleMonthChange}
        slots={{
          day: EventDay
        }}
        slotProps={{
          day: {
            events
          }
        }}
      />
      <Box mt={2}>
        {selectedEvents.length > 0 ? (
          <List>
            {selectedEvents.map(event => (
              <ListItem key={event.id} onClick={() => handleSelectEvent(event)} divider>
                <ListItemText
                  primary={event.title}
                  secondary={`${format(new Date(event.start), 'p')} - ${format(new Date(event.end), 'p')}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant='body1' color='textSecondary'>
            No events for this day.
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default MobileCalendar
