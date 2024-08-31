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

import { addAppointment } from '@/app/actions/appointments'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput'
import AppointmentTypeRadioIcons from './AppointmentTypeRadioIcons'
import ClientSearch from '@/components/clients/ClientSearch'

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
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const onSubmit = async () => {
    if (!values.clientId) {
      setClientError('Please select a client before scheduling the appointment.')

      return
    }

    setClientError('')
    setIsLoading(true)

    const appointmentDate = formatDateToLocalMidnight(values.appointmentDate)
    const startTime = formatTimeToHHMMSS(values.startTime)
    const endTime = formatTimeToHHMMSS(values.endTime)

    const startDate = new Date(appointmentDate)
    const startTimeParts = startTime.split(':')

    startDate.setUTCHours(startTimeParts[0], startTimeParts[1], startTimeParts[2])

    const endDate = new Date(appointmentDate)
    const endTimeParts = endTime.split(':')

    endDate.setUTCHours(endTimeParts[0], endTimeParts[1], endTimeParts[2])

    let appointmentTitle = ''

    switch (values.appointmentType) {
      case 'order_pickup':
        appointmentTitle = 'Order Pickup'
        break
      case 'general':
        appointmentTitle = 'General Appointment'
        break
      case 'initial':
        appointmentTitle = 'Initial Consultation'
        break
      default:
        appointmentTitle = 'Appointment'
    }

    if (!values.clientId) {
      console.error('No client selected')

      return
    }

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

    try {
      const token = await getToken({ template: 'supabase' })

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
        title: `${appointmentTitle} - ${values.clientName}`,
        start: startDate
          .toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6'),
        end: endDate
          .toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6'),
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

      console.log('Before dispatching added action')
      dispatch({ type: 'added', event: transformedAppointment })
      console.log('After dispatching added action')
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

  const handleClientSelect = selectedClient => {
    setValues({
      ...values,
      clientId: selectedClient ? selectedClient.id : null,
      clientName: selectedClient ? selectedClient.full_name : ''
    })
    setClientError('')
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
                  onChange={date => setValues({ ...values, startTime: date })}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat='h:mm aa'
                  timeCaption='Start Time'
                  customInput={<DatePickerInput label='Start Time' dateFormat='h:mm aa' />}
                  minDate={new Date()}
                />
              </FormControl>
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
                  minDate={new Date()}
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
