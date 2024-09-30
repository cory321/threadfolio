import React, { useState, useEffect } from 'react'

import { useAuth } from '@clerk/nextjs'

import { Card, CardHeader, CardContent, Typography, Button, Stack, List, ListItem, ListItemText } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ListAltIcon from '@mui/icons-material/ListAlt'

import { getTotalTimeForGarment, getTimeEntriesGroupedByServiceForGarment } from '@/app/actions/garmentTimeEntries'
import TimeEntryDialog from './TimeEntryDialog'
import TimeLogsDialog from './TimeLogsDialog'

const TimeTracker = ({ sx, garmentId, services }) => {
  const { userId, getToken } = useAuth()
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [serviceTimeData, setServiceTimeData] = useState([])
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)

  const refreshTotalTimeAndServiceData = async () => {
    try {
      const token = await getToken({ template: 'supabase' })

      const totalTime = await getTotalTimeForGarment(userId, garmentId, token)

      setTotalMinutes(totalTime)

      const serviceData = await getTimeEntriesGroupedByServiceForGarment(userId, garmentId, token)

      setServiceTimeData(serviceData)
    } catch (error) {
      console.error('Error fetching total time and service data:', error)
    }
  }

  useEffect(() => {
    refreshTotalTimeAndServiceData()
  }, [garmentId, userId])

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

  return (
    <Card sx={sx}>
      <CardHeader title='Time Tracker' />
      <CardContent>
        <Typography variant='h6'>
          Total time logged for garment: {Math.floor(totalMinutes / 60)} hours {totalMinutes % 60} minutes
        </Typography>
        <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
          <Button variant='contained' startIcon={<AccessTimeIcon />} onClick={handleEntryDialogOpen}>
            Log New
          </Button>
          <Button variant='outlined' startIcon={<ListAltIcon />} onClick={handleLogsDialogOpen}>
            View Logs
          </Button>
        </Stack>

        {serviceTimeData.length > 0 && (
          <>
            <Typography variant='h6' sx={{ mt: 4 }}>
              Time logged per service:
            </Typography>
            <List>
              {serviceTimeData.map(service => (
                <ListItem key={service.id}>
                  <ListItemText
                    primary={`${service.name}: ${Math.floor(service.totalMinutes / 60)} hours ${
                      service.totalMinutes % 60
                    } minutes`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <TimeEntryDialog open={isEntryDialogOpen} handleClose={handleEntryDialogClose} services={services} />
        <TimeLogsDialog open={isLogsDialogOpen} handleClose={handleLogsDialogClose} garmentId={garmentId} />
      </CardContent>
    </Card>
  )
}

export default TimeTracker
