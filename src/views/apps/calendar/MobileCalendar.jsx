'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import { Box, Typography, List, ListItemButton, ListItemText, Grid, Chip, alpha, useTheme } from '@mui/material'
import { LocalizationProvider, DateCalendar, PickersDay } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, isSameDay, getDay } from 'date-fns'

import { daysOfWeek } from '@/utils/dateTimeUtils'

// Appointment Type Map
const appointmentTypeMap = {
  initial: 'Initial Consultation',
  general: 'General Appointment',
  order_pickup: 'Order Pickup'
}

// MobileCalendar Component
const MobileCalendar = ({ events, selectedDate, setSelectedDate, handleSelectEvent, onMonthChange }) => {
  const [selectedEvents, setSelectedEvents] = useState([])
  const theme = useTheme()

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
        views={['month', 'day']}
        slots={{
          day: EventDay
        }}
        slotProps={{
          day: {
            events
          }
        }}
      />
      <Box pb={6}>
        {selectedEvents.length > 0 ? (
          <>
            {/* Date header */}
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.grey[200], 0.5),
                padding: '8px',
                borderRadius: '4px',
                mt: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='subtitle1' color='textSecondary'>
                {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              <Typography variant='subtitle1' color='textSecondary'>
                {daysOfWeek[getDay(selectedDate)]}
              </Typography>
            </Box>
            {/* Appointments List */}
            <List sx={{ padding: 0 }}>
              {selectedEvents.map(appointment => (
                <ListItemButton
                  key={appointment.id}
                  alignItems='flex-start'
                  sx={{ paddingLeft: 2, paddingRight: 2 }}
                  onClick={() => handleSelectEvent(appointment)}
                >
                  <Grid container alignItems='center'>
                    <Grid item xs={7}>
                      <ListItemText
                        primary={
                          <Box display='flex' alignItems='center'>
                            <Typography
                              variant='body1'
                              color='textPrimary'
                              fontWeight='bold'
                              sx={{
                                textDecoration:
                                  appointment.extendedProps?.status === 'cancelled' ? 'line-through' : 'none'
                              }}
                            >
                              {appointment.extendedProps?.clientName}
                            </Typography>
                            {appointment.extendedProps?.status === 'cancelled' && (
                              <Chip label='Cancelled' color='error' size='small' sx={{ ml: 1 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            component='span'
                            variant='body2'
                            color='primary'
                            sx={{
                              textDecoration:
                                appointment.extendedProps?.status === 'cancelled' ? 'line-through' : 'none'
                            }}
                          >
                            {appointmentTypeMap[appointment.extendedProps?.type]}
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid item xs={5} textAlign='right'>
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        sx={{
                          textDecoration: appointment.extendedProps?.status === 'cancelled' ? 'line-through' : 'none'
                        }}
                      >
                        {`${format(new Date(appointment.start), 'p')} - ${format(new Date(appointment.end), 'p')}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              ))}
            </List>
          </>
        ) : (
          <Box display='flex' flexDirection='column' alignItems='center' mt={2}>
            <Box textAlign='center' py={5}>
              <Typography variant='h6' color='textSecondary'>
                No appointments scheduled for this date
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Scheduled appointments will display here
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default MobileCalendar
