import React, { useState } from 'react'

import Link from 'next/link'

import useSWR from 'swr'
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material'
import { format, parse, getDay } from 'date-fns'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/system'
import EventIcon from '@mui/icons-material/Event'

import ViewAppointmentModal from '@/views/apps/calendar/ViewAppointmentModal'
import { getAppointments } from '@/app/actions/appointments'

const UpcomingAppointments = () => {
  const theme = useTheme()
  const [viewEventModalOpen, setViewEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleViewEventModalToggle = () => {
    setViewEventModalOpen(!viewEventModalOpen)
  }

  const handleAppointmentClick = appointment => {
    setSelectedEvent(appointment)
    handleViewEventModalToggle()
  }

  // Format today's date to 'yyyy-MM-dd'
  const today = format(new Date(), 'yyyy-MM-dd')

  // Use SWR to fetch appointments starting from today
  const {
    data: appointments = [],
    error,
    isLoading,
    mutate
  } = useSWR(['appointments', today], (_, date) => getAppointments(date))

  const appointmentTypeMap = {
    initial: 'Initial Consultation',
    general: 'General Appointment',
    order_pickup: 'Order Pickup'
  }

  if (error) {
    return (
      <Box>
        <Typography color='error'>Failed to load appointments</Typography>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress />
      </Box>
    )
  }

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = format(new Date(appointment.start), 'MMMM d, yyyy')

    if (!acc[date]) {
      acc[date] = []
    }

    acc[date].push(appointment)

    return acc
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => parse(a, 'MMMM d, yyyy', new Date()) - parse(b, 'MMMM d, yyyy', new Date())
  )

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Get the next 5 appointment dates
  const nextFiveDates = sortedDates.slice(0, 5)

  // Function to handle appointment cancellation
  const handleAppointmentCancelled = async cancelledAppointmentId => {
    // Optimistically update the cached data
    mutate(
      appointments => {
        return appointments.filter(appointment => appointment.id !== cancelledAppointmentId)
      },
      false // Do not revalidate immediately
    )
  }

  return (
    <Box>
      <Box display='flex' flexDirection='column'>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center'>
            <Avatar sx={{ mr: 1 }}>
              <EventIcon />
            </Avatar>
            <Typography variant='h6'>Upcoming Appointments</Typography>
          </Box>
          <Link href='/appointments' passHref>
            <Button variant='outlined' color='primary'>
              View All
            </Button>
          </Link>
        </Box>
      </Box>
      {appointments.length === 0 ? (
        <Box display='flex' flexDirection='column' alignItems='center' mt={2}>
          <Typography variant='body1' color='textSecondary'>
            You have no upcoming appointments scheduled
          </Typography>
          <Link href='/appointments' passHref>
            <Button variant='text' color='primary'>
              View Calendar
            </Button>
          </Link>
        </Box>
      ) : (
        <List sx={{ padding: 0 }}>
          {nextFiveDates.map(date => (
            <Box key={date}>
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
                  {date}
                </Typography>
                <Typography variant='subtitle1' color='textSecondary'>
                  {daysOfWeek[getDay(parse(date, 'MMMM d, yyyy', new Date()))]}
                </Typography>
              </Box>
              {groupedAppointments[date].map(appointment => (
                <ListItemButton
                  key={appointment.id}
                  alignItems='flex-start'
                  sx={{ paddingLeft: 2, paddingRight: 2 }}
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <Grid container alignItems='center'>
                    <Grid item xs={9}>
                      <ListItemText
                        primary={
                          <Box display='flex' alignItems='center'>
                            <Typography
                              variant='body1'
                              color='textPrimary'
                              fontWeight='bold'
                              sx={{
                                textDecoration:
                                  appointment.extendedProps.status === 'cancelled' ? 'line-through' : 'none'
                              }}
                            >
                              {appointment.extendedProps.clientName}
                            </Typography>
                            {appointment.extendedProps.status === 'cancelled' && (
                              <Chip label='Cancelled' color='error' size='small' sx={{ ml: 1 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component='span'
                              variant='body2'
                              color='primary'
                              sx={{
                                textDecoration:
                                  appointment.extendedProps.status === 'cancelled' ? 'line-through' : 'none'
                              }}
                            >
                              {appointmentTypeMap[appointment.extendedProps.type]}
                            </Typography>
                          </>
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        sx={{
                          textDecoration: appointment.extendedProps.status === 'cancelled' ? 'line-through' : 'none'
                        }}
                      >
                        {`${format(new Date(appointment.start), 'p')} - ${format(new Date(appointment.end), 'p')}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>
      )}
      {/* ViewAppointmentModal */}
      {selectedEvent && (
        <ViewAppointmentModal
          open={viewEventModalOpen}
          handleClose={handleViewEventModalToggle}
          selectedEvent={selectedEvent}
          onAppointmentCancelled={handleAppointmentCancelled}
          refreshEvents={mutate}
        />
      )}
    </Box>
  )
}

export default UpcomingAppointments
