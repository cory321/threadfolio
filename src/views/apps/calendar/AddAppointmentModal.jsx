import React, { useState, useEffect } from 'react'

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
  Grid,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAuth } from '@clerk/nextjs'

import { setHours, setMinutes } from 'date-fns'

import { toast } from 'react-toastify'

import { addAppointment } from '@/app/actions/appointments'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput'
import AppointmentTypeRadioIcons from './AppointmentTypeRadioIcons'
import ClientSearch from '@/components/clients/ClientSearch'

import { adjustEndTimeIfNeeded } from '@/utils/dateTimeUtils'

const AddAppointmentModal = props => {
  const { addEventModalOpen, handleAddEventModalToggle, selectedDate, dispatch } = props
  const { userId, getToken } = useAuth()

  // Function to get the next nearest hour
  const getNextNearestHour = () => {
    const now = new Date()

    now.setMinutes(0, 0, 0)
    now.setHours(now.getHours() + 1)

    return now
  }

  const defaultState = {
    clientId: null,
    appointmentDate: selectedDate || new Date(),
    startTime: getNextNearestHour(),
    endTime: new Date(getNextNearestHour().getTime() + 60 * 60 * 1000), // 1 hour later
    location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
    appointmentType: 'general',
    notes: '',
    sendConfirmation: false
  }

  const [values, setValues] = useState(defaultState)
  const [isLoading, setIsLoading] = useState(false)
  const [clientError, setClientError] = useState('')

  const { handleSubmit } = useForm()

  useEffect(() => {
    setValues(prevValues => ({
      ...prevValues,
      appointmentDate: selectedDate || new Date()
    }))
  }, [selectedDate])

  useEffect(() => {
    if (values.startTime >= values.endTime) {
      setValues(prevValues => ({
        ...prevValues,
        endTime: new Date(new Date(values.startTime).getTime() + 60 * 60 * 1000) // 1 hour later
      }))
    }
  }, [values.startTime])

  const handleModalClose = () => {
    setValues({
      ...defaultState,
      appointmentDate: selectedDate || new Date()
    })
    handleAddEventModalToggle()
  }

  const formatDateToLocalMidnight = date => {
    const localDate = new Date(date)

    localDate.setHours(0, 0, 0, 0)

    return localDate.toISOString().split('T')[0]
  }

  const formatTimeToHHMMSS = date => {
    return date.toTimeString().split(' ')[0]
  }

  const onSubmit = async () => {
    if (!values.clientId) {
      setClientError('Please select a client before scheduling the appointment.')

      return
    }

    if (values.startTime >= values.endTime) {
      setClientError('End time must be after start time.')

      return
    }

    setClientError('')
    setIsLoading(true)

    try {
      const token = await getToken({ template: 'supabase' })

      const appointmentDate = formatDateToLocalMidnight(values.appointmentDate)
      const startTime = formatTimeToHHMMSS(values.startTime)
      const endTime = formatTimeToHHMMSS(values.endTime)

      const newAppointment = {
        clientId: values.clientId,
        userId,
        appointmentDate,
        startTime,
        endTime,
        location: values.location,
        status: 'scheduled',
        type: values.appointmentType,
        sendEmail: values.sendConfirmation,
        sendSms: values.sendConfirmation,
        notes: values.notes
      }

      const data = await addAppointment(
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

      const transformedAppointment = {
        id: data.id,
        title: `${values.appointmentType} - ${values.clientName}`,
        start: new Date(`${appointmentDate}T${startTime}`),
        end: new Date(`${appointmentDate}T${endTime}`),
        allDay: false,
        extendedProps: {
          location: data.location,
          status: data.status,
          type: data.type,
          sendEmail: data.send_email,
          sendSms: data.send_sms,
          notes: data.notes,
          clientName: values.clientName
        }
      }

      // Check if end time is before start time
      if (transformedAppointment.end < transformedAppointment.start) {
        // If so, assume it's meant to be the next day
        transformedAppointment.end.setDate(transformedAppointment.end.getDate() + 1)
      }

      dispatch({ type: 'added', event: transformedAppointment })
      props.handleAddEvent(transformedAppointment)
      toast.success('Appointment has been scheduled')
      handleModalClose()
    } catch (error) {
      console.error('Failed to add appointment:', error)
      setClientError(error.message || 'Failed to add appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppointmentTypeChange = selectedType => {
    setValues({ ...values, appointmentType: selectedType })
  }

  const handleClientSelect = selectedClient => {
    setValues({
      ...values,
      clientId: selectedClient ? selectedClient.id : null,
      clientName: selectedClient ? selectedClient.full_name : ''
    })
    setClientError('')
  }

  const handleStartTimeChange = date => {
    const newStartTime = new Date(date)
    let newEndTime = new Date(values.endTime)

    if (newStartTime >= newEndTime) {
      newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000) // 1 hour later
    }

    setValues({
      ...values,
      startTime: newStartTime,
      endTime: newEndTime
    })
  }

  const handleEndTimeChange = date => {
    const newEndTime = adjustEndTimeIfNeeded(values.startTime, date)

    setValues({
      ...values,
      endTime: newEndTime
    })
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
              minDate={new Date()}
            />
          </FormControl>

          <FormControl fullWidth margin='normal' style={{ marginBottom: '16px' }}>
            <ClientSearch userId={userId} onClientSelect={handleClientSelect} />
            {clientError && (
              <Typography color='error' variant='caption' style={{ marginTop: '8px' }}>
                {clientError}
              </Typography>
            )}
          </FormControl>

          <Grid container spacing={2} style={{ marginTop: '0' }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <AppReactDatepicker
                  selected={values.startTime}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat='h:mm aa'
                  timeCaption='Start Time'
                  customInput={<DatePickerInput label='Start Time' dateFormat='h:mm aa' />}
                  minTime={setHours(setMinutes(new Date(), 0), 0)}
                  maxTime={setHours(setMinutes(new Date(), 45), 23)}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <AppReactDatepicker
                  selected={values.endTime}
                  onChange={handleEndTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat='h:mm aa'
                  timeCaption='End Time'
                  customInput={<DatePickerInput label='End Time' dateFormat='h:mm aa' />}
                  minTime={setHours(setMinutes(new Date(), 0), 0)}
                  maxTime={setHours(setMinutes(new Date(), 45), 23)}
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
