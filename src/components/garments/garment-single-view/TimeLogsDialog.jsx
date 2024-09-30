import React, { useState, useEffect } from 'react'

import { useAuth } from '@clerk/nextjs'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { format } from 'date-fns'

import { getTimeEntriesForGarment } from '@/app/actions/garmentTimeEntries'

const TimeLogsDialog = ({ open, handleClose, garmentId }) => {
  const [timeEntries, setTimeEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { userId, getToken } = useAuth()

  useEffect(() => {
    if (open) {
      fetchTimeEntries()
    }
  }, [open, garmentId, userId])

  const fetchTimeEntries = async () => {
    setIsLoading(true)

    try {
      const token = await getToken({ template: 'supabase' })
      const entries = await getTimeEntriesForGarment(userId, garmentId, token)

      setTimeEntries(entries)
    } catch (error) {
      console.error('Failed to fetch time entries:', error)
      alert('Failed to fetch time entries.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>All logged time for this garment</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <CircularProgress />
        ) : timeEntries.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Time Logged</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.logged_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{entry.garment_services.name}</TableCell>
                    <TableCell>{`${Math.floor(entry.minutes / 60)}h ${entry.minutes % 60}m`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No time entries found for this garment.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TimeLogsDialog
