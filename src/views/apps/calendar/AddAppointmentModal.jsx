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
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAuth } from '@clerk/nextjs'

import { setHours, setMinutes } from 'date-fns'

import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'

import { addAppointment } from '@/app/actions/appointments'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput'
import AppointmentTypeRadioIcons from './AppointmentTypeRadioIcons'
import ClientSearch from '@/components/clients/ClientSearch'

import { adjustEndTimeIfNeeded } from '@/utils/dateTimeUtils'

const AddAppointmentModal = props => {
  const { addEventModalOpen, handleAddEventModalToggle, selectedDate, dispatch, onAddAppointment } = props
  const { userId, getToken } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Function to get the next nearest hour
  const getNextNearestHour = () => {
    const now = new Date()

    now.setMinutes(0, 0, 0)
    now.setHours(now.getHours() + 1)

    return now
  }

  const defaultState = {
    clientId: null,
    startTime: getNextNearestHour(),
    endTime: new Date(getNextNearestHour().getTime() + 60 * 60 * 1000), // 1 hour later
    location: '1234 Seamstress Shop Ave. Paso Robles, CA 93446',
    appointmentType: 'general',
    notes: '',
    sendEmail: false,
    sendSms: false
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
  }, [values.startTime, values.endTime])

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

  const combineDateAndTime = (date, time) => {
    const combined = new Date(date)

    combined.setHours(time.getHours())
    combined.setMinutes(time.getMinutes())
    combined.setSeconds(0)
    combined.setMilliseconds(0)

    return combined
  }

  const onSubmit = async () => {
    if (!values.clientId) {
      setClientError('Please select a client before scheduling the appointment.')

      return
    }

    setClientError('')
    setIsLoading(true)

    try {
      const token = await getToken({ template: 'supabase' })

      let startDateTime = combineDateAndTime(values.appointmentDate, values.startTime)
      let endDateTime = combineDateAndTime(values.appointmentDate, values.endTime)

      // If end time is before start time, assume it's for the next day
      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1)
      }

      const newAppointment = {
        clientId: values.clientId,
        userId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: values.location,
        status: 'scheduled',
        type: values.appointmentType,
        sendEmail: values.sendEmail,
        sendSms: values.sendSms,
        notes: values.notes
      }

      const data = await addAppointment(
        newAppointment.clientId,
        newAppointment.userId,
        newAppointment.startTime,
        newAppointment.endTime,
        newAppointment.location,
        newAppointment.status,
        newAppointment.type,
        newAppointment.notes,
        newAppointment.sendEmail,
        newAppointment.sendSms,
        token
      )

      // Call onAddAppointment to update local state
      onAddAppointment(data)

      handleAddEventModalToggle()
      toast.success('Appointment added successfully')
    } catch (error) {
      console.error('Error adding appointment:', error)
      toast.error('Failed to add appointment. Please try again.')
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
      fullScreen={fullScreen}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        Add Appointment
        <IconButton
          aria-label='close'
          onClick={handleModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
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
                checked={values.sendEmail}
                onChange={e => setValues({ ...values, sendEmail: e.target.checked })}
              />
            }
            label='Send Confirmation Email'
          />
          <FormControlLabel
            control={
              <Switch checked={values.sendSms} onChange={e => setValues({ ...values, sendSms: e.target.checked })} />
            }
            label='Send Confirmation SMS'
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
