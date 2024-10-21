import React from 'react'

import { List, ListItem, ListItemText, Typography, Box, Button, Chip } from '@mui/material'
import { format, parse, getDay } from 'date-fns'

import { daysOfWeek } from '@/utils/dateTimeUtils'

const AppointmentList = ({ appointments, isHistory = false }) => {
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = format(new Date(appointment.start), 'MMMM d, yyyy')

    if (!acc[date]) {
      acc[date] = []
    }

    acc[date].push(appointment)

    return acc
  }, {})

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) =>
    isHistory
      ? parse(b, 'MMMM d, yyyy', new Date()) - parse(a, 'MMMM d, yyyy', new Date())
      : parse(a, 'MMMM d, yyyy', new Date()) - parse(b, 'MMMM d, yyyy', new Date())
  )

  return (
    <Box>
      <List sx={{ padding: 0 }}>
        {sortedDates.map(date => (
          <Box key={date}>
            <Box
              sx={{
                backgroundColor: theme => theme.palette.grey[200],
                padding: '8px',
                borderRadius: '4px',
                mt: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='subtitle1' color='textSecondary'>
                {date}
              </Typography>
              <Typography variant='subtitle1' color='textSecondary'>
                {daysOfWeek[getDay(parse(date, 'MMMM d, yyyy', new Date()))]}
              </Typography>
            </Box>
            {groupedAppointments[date].map(appointment => (
              <ListItem
                key={appointment.id}
                alignItems='center'
                sx={{ paddingLeft: 2, paddingRight: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        fontWeight='bold'
                        sx={{
                          textDecoration: appointment.extendedProps.status === 'cancelled' ? 'line-through' : 'none'
                        }}
                      >
                        {appointment.title.split(' - ')[0]}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component='span'
                          variant='body2'
                          color='primary'
                          sx={{
                            textDecoration: appointment.extendedProps.status === 'cancelled' ? 'line-through' : 'none'
                          }}
                        >
                          {`${format(new Date(appointment.start), 'p')} - ${format(new Date(appointment.end), 'p')}`}
                        </Typography>
                        <br />
                        <Typography
                          component='span'
                          variant='body2'
                          color='textSecondary'
                          sx={{
                            textDecoration: appointment.extendedProps.status === 'cancelled' ? 'line-through' : 'none'
                          }}
                        >
                          {appointment.extendedProps.location}
                        </Typography>
                      </>
                    }
                  />
                </Box>
                {appointment.extendedProps.status === 'cancelled' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <Chip
                      label='Cancelled'
                      color='error'
                      size='small'
                      variant='outlined'
                      sx={{
                        height: '24px',
                        '& .MuiChip-label': {
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Box>
                )}
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </Box>
  )
}

export default AppointmentList
