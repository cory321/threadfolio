import React, { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@clerk/nextjs'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  DialogContentText,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { format } from 'date-fns'
import { Edit, Delete, WarningAmberRounded, Close } from '@mui/icons-material'
import { toast } from 'react-toastify'

import { getTimeEntriesForGarment, updateTimeEntry, deleteTimeEntry } from '@/app/actions/garmentTimeEntries'

const TimeLogsDialog = ({ open, handleClose, garmentId, onChange }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [timeEntries, setTimeEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [editHours, setEditHours] = useState('')
  const [editMinutes, setEditMinutes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTimeEntries = useCallback(async () => {
    setIsLoading(true)

    try {
      const entries = await getTimeEntriesForGarment(userId, garmentId)

      setTimeEntries(entries)
    } catch (error) {
      console.error('Failed to fetch time entries:', error)
      alert('Failed to fetch time entries.')
    } finally {
      setIsLoading(false)
    }
  }, [garmentId, userId])

  useEffect(() => {
    if (open) {
      fetchTimeEntries()
    }
  }, [open, fetchTimeEntries])

  // Open Edit Dialog
  const handleEditEntry = entry => {
    setSelectedEntry(entry)
    setEditHours(Math.floor(entry.minutes / 60).toString())
    setEditMinutes((entry.minutes % 60).toString())
    setEditDialogOpen(true)
  }

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedEntry(null)
    setEditHours('')
    setEditMinutes('')
  }

  // Update Time Entry
  const handleUpdateEntry = async () => {
    setIsSubmitting(true)

    try {
      const totalMinutes = parseInt(editHours || '0') * 60 + parseInt(editMinutes || '0')

      if (totalMinutes <= 0) {
        toast.error('Please enter valid hours or minutes.', {
          hideProgressBar: false
        })
        setIsSubmitting(false)

        return
      }

      await updateTimeEntry(userId, selectedEntry.id, totalMinutes)

      // Update the local state
      setTimeEntries(prevEntries =>
        prevEntries.map(entry => (entry.id === selectedEntry.id ? { ...entry, minutes: totalMinutes } : entry))
      )

      handleCloseEditDialog()
      toast.success('Time entry updated successfully!', {
        hideProgressBar: false
      })

      if (onChange) onChange() // Notify parent component
    } catch (error) {
      console.error('Failed to update time entry:', error)
      toast.error('Failed to update time entry. Please try again.', {
        hideProgressBar: false
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open Delete Dialog
  const handleDeleteEntry = entry => {
    setSelectedEntry(entry)
    setDeleteDialogOpen(true)
  }

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedEntry(null)
  }

  // Delete Time Entry
  const handleConfirmDelete = async () => {
    setIsSubmitting(true)

    try {
      await deleteTimeEntry(userId, selectedEntry.id)

      // Update the local state
      setTimeEntries(prevEntries => prevEntries.filter(entry => entry.id !== selectedEntry.id))

      handleCloseDeleteDialog()
      toast.success('Time entry deleted successfully!', {
        hideProgressBar: false
      })

      if (onChange) onChange() // Notify parent component
    } catch (error) {
      console.error('Failed to delete time entry:', error)
      toast.error('Failed to delete time entry. Please try again.', {
        hideProgressBar: false
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm' fullScreen={fullScreen}>
      <DialogTitle>
        All logged time for this garment
        <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
            <CircularProgress
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            />
          </Box>
        ) : timeEntries.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Time Logged</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.logged_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{entry.garment_services.name}</TableCell>
                    <TableCell>{`${Math.floor(entry.minutes / 60)}h ${entry.minutes % 60}m`}</TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => handleEditEntry(entry)}>
                        <Edit fontSize='small' />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDeleteEntry(entry)}>
                        <Delete fontSize='small' />
                      </IconButton>
                    </TableCell>
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

      {/* Edit Time Entry Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Time Entry</DialogTitle>
        <DialogContent>
          <TextField
            label='Hours'
            type='number'
            value={editHours}
            onChange={e => setEditHours(e.target.value)}
            fullWidth
            margin='normal'
            inputProps={{ min: 0, step: 1 }}
          />
          <TextField
            label='Minutes'
            type='number'
            value={editMinutes}
            onChange={e => setEditMinutes(e.target.value)}
            fullWidth
            margin='normal'
            inputProps={{ min: 0, max: 59, step: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleUpdateEntry} variant='contained' disabled={isSubmitting}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Time Entry?</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <WarningAmberRounded sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <DialogContentText>Deleting this time entry cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='error'
            variant='contained'
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color='inherit' /> : null}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default TimeLogsDialog
