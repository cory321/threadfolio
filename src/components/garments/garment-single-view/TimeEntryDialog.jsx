import React, { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material'

import { addTimeEntry } from '@/app/actions/garments'

const TimeEntryDialog = ({ open, handleClose, services }) => {
  const { userId, getToken } = useAuth()
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    const totalMinutes = parseInt(hours || '0') * 60 + parseInt(minutes || '0')

    if (totalMinutes <= 0 || !selectedServiceId) {
      alert('Please select a service and enter valid hours or minutes.')

      return
    }

    setIsSubmitting(true)

    try {
      const token = await getToken({ template: 'supabase' })

      await addTimeEntry(userId, selectedServiceId, totalMinutes, token)
      handleClose(true)
    } catch (error) {
      console.error('Failed to log time:', error)
      alert('Failed to log time. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>Add Work Hours</DialogTitle>
      <DialogContent>
        <TextField
          select
          label='Service'
          value={selectedServiceId}
          onChange={e => setSelectedServiceId(e.target.value)}
          fullWidth
          margin='normal'
        >
          {services.map(service => (
            <MenuItem key={service.id} value={service.id}>
              {service.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label='Hours'
          type='number'
          value={hours}
          onChange={e => setHours(e.target.value)}
          fullWidth
          margin='normal'
          inputProps={{ min: 0, step: 1 }}
        />
        <TextField
          label='Minutes'
          type='number'
          value={minutes}
          onChange={e => setMinutes(e.target.value)}
          fullWidth
          margin='normal'
          inputProps={{ min: 0, max: 59, step: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant='contained' disabled={isSubmitting}>
          Log Time
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TimeEntryDialog
