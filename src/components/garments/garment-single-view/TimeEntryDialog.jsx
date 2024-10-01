import React, { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton,
  CircularProgress,
  Typography
} from '@mui/material'
import { Close } from '@mui/icons-material'

import { addTimeEntry } from '@/app/actions/garmentTimeEntries'

const TimeEntryDialog = ({ open, handleClose, services }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const { userId, getToken } = useAuth()
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!selectedServiceId) {
      newErrors.service = 'Please select a service'
    }

    const totalMinutes = parseInt(hours || '0') * 60 + parseInt(minutes || '0')

    if (totalMinutes <= 0) {
      newErrors.time = 'Please enter valid hours or minutes'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const token = await getToken({ template: 'supabase' })
      const totalMinutes = parseInt(hours || '0') * 60 + parseInt(minutes || '0')

      await addTimeEntry(userId, selectedServiceId, totalMinutes, token)
      handleClose(true)
    } catch (error) {
      console.error('Failed to log time:', error)
      setErrors({ submit: 'Failed to log time. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={() => handleClose()} fullScreen={fullScreen}>
      <DialogTitle>
        Add Work Hours
        <IconButton
          aria-label='close'
          onClick={() => handleClose()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          select
          label='Service'
          value={selectedServiceId}
          onChange={e => {
            setSelectedServiceId(e.target.value)
            setErrors(prev => ({ ...prev, service: '' }))
          }}
          fullWidth
          margin='normal'
          error={!!errors.service}
          helperText={errors.service}
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
          onChange={e => {
            // Allow only integer values
            const value = e.target.value.replace(/\D/g, '')

            setHours(value)
            setErrors(prev => ({ ...prev, time: '' }))
          }}
          fullWidth
          margin='normal'
          inputProps={{
            min: 0,
            step: 1,
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          error={!!errors.time}
        />
        <TextField
          label='Minutes'
          type='number'
          value={minutes}
          onChange={e => {
            // Allow only integer values
            const value = e.target.value.replace(/\D/g, '')

            setMinutes(value)
            setErrors(prev => ({ ...prev, time: '' }))
          }}
          fullWidth
          margin='normal'
          inputProps={{
            min: 0,
            max: 59,
            step: 1,
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          error={!!errors.time}
          helperText={errors.time}
        />
        {errors.submit && (
          <Typography color='error' variant='body2' sx={{ mt: 2 }}>
            {errors.submit}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant='contained'
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress color='inherit' size={20} /> : null}
        >
          {isSubmitting ? 'Logging...' : 'Log Time'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TimeEntryDialog
