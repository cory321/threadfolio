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
  Tooltip
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ScheduleIcon from '@mui/icons-material/Schedule'

import { getTotalTimeForGarment, getTimeEntriesGroupedByServiceForGarment } from '@/app/actions/garmentTimeEntries'
import TimeEntryDialog from './TimeEntryDialog'
import TimeLogsDialog from './TimeLogsDialog'

const TimeTracker = ({ sx, garmentId, services, garmentName }) => {
  const { userId, getToken } = useAuth()
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [serviceTimeData, setServiceTimeData] = useState([])
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)

  const refreshTotalTimeAndServiceData = useCallback(async () => {
    try {
      const token = await getToken({ template: 'supabase' })

      const totalTime = await getTotalTimeForGarment(userId, garmentId, token)

      setTotalMinutes(totalTime)

      const serviceData = await getTimeEntriesGroupedByServiceForGarment(userId, garmentId, token)

      setServiceTimeData(serviceData)
    } catch (error) {
      console.error('Error fetching total time and service data:', error)
    }
  }, [getToken, garmentId, userId])

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

  return (
    <Card sx={sx}>
      <CardHeader title='Time Tracker' />
      <CardContent>
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
              <Button
                variant='outlined'
                startIcon={<ListAltIcon />}
                onClick={handleLogsDialogOpen}
                aria-label='View time logs'
              >
                View Logs
              </Button>
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
            <Typography variant='h6' gutterBottom>
              Time Logged per Service
            </Typography>
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
                      <Typography variant='subtitle1'>{service.name}</Typography>
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
