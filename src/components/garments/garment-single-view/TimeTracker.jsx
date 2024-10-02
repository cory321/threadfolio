import React, { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@clerk/nextjs'

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  Divider,
  Box,
  Tooltip,
  Skeleton
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ScheduleIcon from '@mui/icons-material/Schedule'

import { getTotalTimeForGarment, getTimeEntriesGroupedByServiceForGarment } from '@/app/actions/garmentTimeEntries'
import TimeEntryDialog from './TimeEntryDialog'
import TimeLogsDialog from './TimeLogsDialog'

const TimeTracker = ({ sx, garmentId, services, garmentName }) => {
  const { userId } = useAuth()
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [serviceTimeData, setServiceTimeData] = useState([])
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshTotalTimeAndServiceData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [totalTime, serviceData] = await Promise.all([
        getTotalTimeForGarment(userId, garmentId),
        getTimeEntriesGroupedByServiceForGarment(userId, garmentId)
      ])

      setTotalMinutes(totalTime)
      setServiceTimeData(serviceData)
    } catch (error) {
      console.error('Error fetching total time and service data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [, garmentId, userId])

  useEffect(() => {
    refreshTotalTimeAndServiceData()
  }, [garmentId, userId, refreshTotalTimeAndServiceData])

  const handleEntryDialogOpen = () => {
    setIsEntryDialogOpen(true)
  }

  const handleEntryDialogClose = (shouldRefresh = false) => {
    setIsEntryDialogOpen(false)

    if (shouldRefresh) {
      refreshTotalTimeAndServiceData()
    }
  }

  const handleLogsDialogOpen = () => {
    setIsLogsDialogOpen(true)
  }

  const handleLogsDialogClose = () => {
    setIsLogsDialogOpen(false)
  }

  // Filter out services with 0 minutes
  const filteredServiceTimeData = serviceTimeData.filter(service => service.totalMinutes > 0)

  // Check if there are any services available
  const hasServices = services && services.length > 0

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title='Time Tracker' />
      <CardContent>
        {/* Loading State */}
        {isLoading ? (
          <>
            {/* Skeleton for Total Time Logged */}
            <Box display='flex' alignItems='center' mb={2}>
              <Skeleton variant='circular' width={40} height={40} sx={{ mr: 1 }} />
              <Skeleton variant='text' width='80%' height={40} />
            </Box>

            {/* Skeleton for Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Skeleton variant='rectangular' width={120} height={36} sx={{ mr: 2 }} />
              <Skeleton variant='rectangular' width={120} height={36} />
            </Box>

            {/* Skeleton for Time Logged per Service */}
            <Divider sx={{ my: 3 }} />
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[1].map(index => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Skeleton variant='circular' width={30} height={30} sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant='text' width='60%' />
                    <Skeleton variant='text' width='40%' />
                  </Box>
                </Paper>
              ))}
            </Stack>
          </>
        ) : (
          <>
            {hasServices ? (
              <>
                {/* Total Time Logged */}
                {filteredServiceTimeData.length > 0 ? (
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12}>
                      <Box display='flex' alignItems='center'>
                        <ScheduleIcon color='primary' sx={{ mr: 1 }} />
                        <Typography variant='h6'>
                          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m logged for {garmentName}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' mt={2}>
                    <ScheduleIcon color='action' sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant='body1' align='center'>
                      No time has been logged yet for this garment.
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <Grid container spacing={2} alignItems='center' sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Stack direction='row' spacing={2} justifyContent='center'>
                      {filteredServiceTimeData.length > 0 && (
                        <Button
                          variant='outlined'
                          startIcon={<ListAltIcon />}
                          onClick={handleLogsDialogOpen}
                          aria-label='View time logs'
                        >
                          View Logs
                        </Button>
                      )}
                      <Button
                        variant='contained'
                        startIcon={<AccessTimeIcon />}
                        onClick={handleEntryDialogOpen}
                        aria-label='Log new time entry'
                      >
                        Log New
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Time Logged per Service */}
                {filteredServiceTimeData.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Stack spacing={2}>
                      {filteredServiceTimeData.map(service => {
                        const hours = Math.floor(service.totalMinutes / 60)
                        const minutes = service.totalMinutes % 60

                        return (
                          <Paper
                            key={service.id}
                            elevation={1}
                            sx={{
                              p: 2,
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'box-shadow 0.3s',
                              '&:hover': {
                                boxShadow: 3,
                                cursor: 'pointer'
                              }
                            }}
                          >
                            <Tooltip title={`Logged time for ${service.name}`}>
                              <AccessTimeIcon color='action' sx={{ mr: 2 }} />
                            </Tooltip>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant='h6'>{service.name}</Typography>
                              <Typography variant='body2' color='textSecondary'>
                                {hours}h {minutes}m logged
                              </Typography>
                            </Box>
                          </Paper>
                        )
                      })}
                    </Stack>
                  </>
                )}
              </>
            ) : (
              <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' mt={2}>
                <ScheduleIcon color='action' sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant='body1' align='center'>
                  Please add services to log time entries.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Dialogs */}
        <TimeEntryDialog open={isEntryDialogOpen} handleClose={handleEntryDialogClose} services={services} />
        <TimeLogsDialog
          open={isLogsDialogOpen}
          handleClose={handleLogsDialogClose}
          garmentId={garmentId}
          onChange={refreshTotalTimeAndServiceData}
        />
      </CardContent>
    </Card>
  )
}

export default TimeTracker
