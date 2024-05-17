'use client'

import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAuth } from '@clerk/nextjs'

import { addAppointmentAction } from '@actions/appointments'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput'
import AppointmentTypeRadioIcons from './AppointmentTypeRadioIcons'

const defaultState = {
  clientId: '71cd77e6-34b5-43ee-994a-aa5d471a00e5',
  appointmentDate: new Date(),
  startTime: new Date(),
  endTime: new Date(),
  location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
  appointmentType: 'general',
  notes: '',
  sendConfirmation: false
}

const AddAppointmentModal = props => {
  const { addEventModalOpen, handleAddEventModalToggle, handleAddAppointment } = props
  const { userId, getToken } = useAuth()

  const [values, setValues] = useState(defaultState)
  const [isLoading, setIsLoading] = useState(false)

  const { handleSubmit } = useForm()

  const handleModalClose = () => {
    setValues(defaultState)
    handleAddEventModalToggle()
  }

  const formatDateToLocalMidnight = date => {
    const localDate = new Date(date)

    localDate.setHours(0, 0, 0, 0)

    return localDate.toISOString().split('T')[0]
  }

  const formatTimeToHHMMSS = date => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const onSubmit = async () => {
    setIsLoading(true)

    const newAppointment = {
      clientId: values.clientId,
      userId: userId, // Use Clerk's userId
      appointmentDate: formatDateToLocalMidnight(values.appointmentDate), // Local midnight date
      startTime: formatTimeToHHMMSS(values.startTime),
      endTime: formatTimeToHHMMSS(values.endTime),
      location: values.location,
      status: 'scheduled', // Default status
      type: values.appointmentType,
      sendEmail: values.sendConfirmation,
      sendSms: values.sendConfirmation,
      notes: values.notes
    }

    try {
      const token = await getToken({ template: 'supabase' }) // Get the token using Clerk

      const data = await addAppointmentAction(
        newAppointment.clientId,
        newAppointment.userId,
        newAppointment.appointmentDate,
        newAppointment.startTime,
        newAppointment.endTime,
        newAppointment.location,
        newAppointment.status,
        newAppointment.type,
        newAppointment.sendEmail,
        newAppointment.sendSms,
        newAppointment.notes,
        token
      )

      handleAddAppointment(data)

      // Close the modal upon successful submission
    } catch (error) {
      console.error('Failed to add appointment:', error)
    } finally {
      setIsLoading(false)
      handleModalClose()
    }
  }

  const handleAppointmentTypeChange = selectedType => {
    setValues({ ...values, appointmentType: selectedType })
  }

  return (
    <Dialog
      open={addEventModalOpen}
      onClose={handleModalClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Add Appointment</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <FormControl fullWidth margin='normal' style={{ marginBottom: '8px' }}>
            <AppReactDatepicker
              selected={values.appointmentDate}
              onChange={date => setValues({ ...values, appointmentDate: date })}
              customInput={<DatePickerInput label='Appointment Date' dateFormat='EEEE, MMMM d, yyyy' />}
            />
          </FormControl>

          <Grid container spacing={2} style={{ marginTop: '0' }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <AppReactDatepicker
                  selected={values.startTime}
                  onChange={date => setValues({ ...values, startTime: date })}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat='h:mm aa'
                  timeCaption='Start Time'
                  customInput={<DatePickerInput label='Start Time' dateFormat='h:mm aa' />}
                />
              </FormControl>{' '}
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <AppReactDatepicker
                  selected={values.endTime}
                  onChange={date => setValues({ ...values, endTime: date })}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat='h:mm aa'
                  timeCaption='End Time'
                  customInput={<DatePickerInput label='End Time' dateFormat='h:mm aa' />}
                />
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth margin='normal'>
            <TextField
              label='Location'
              value={values.location}
              onChange={e => setValues({ ...values, location: e.target.value })}
            />
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <AppointmentTypeRadioIcons onChange={handleAppointmentTypeChange} />
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <TextField
              label='Notes'
              multiline
              rows={4}
              value={values.notes}
              onChange={e => setValues({ ...values, notes: e.target.value })}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={values.sendConfirmation}
                onChange={e => setValues({ ...values, sendConfirmation: e.target.checked })}
              />
            }
            label='Send Confirmation Email'
          />
          <DialogActions>
            <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? 'Scheduling...' : 'Schedule'}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleModalClose} disabled={isLoading}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAppointmentModal
