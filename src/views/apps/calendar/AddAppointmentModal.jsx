import { useState, useEffect } from 'react'

import { mutate } from 'swr'
import { format } from 'date-fns'
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
  IconButton,
  Box
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'

import { LocalizationProvider, TimePicker, MobileTimePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import InitialsAvatar from '@/components/InitialsAvatar'
import { addAppointment } from '@/app/actions/appointments'
import { getBusinessInfo } from '@/app/actions/users'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput'
import AppointmentTypeRadioIcons from './AppointmentTypeRadioIcons'
import ClientSearch from '@/components/clients/ClientSearch'

function AddAppointmentModal({
  addEventModalOpen,
  handleAddEventModalToggle,
  selectedDate,
  mutateAppointments = () => {},
  client
}) {
  const { userId } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Define TimePickerComponent based on screen size
  const TimePickerComponent = isMobile ? MobileTimePicker : TimePicker

  // Function to get the next nearest hour
  const getNextNearestHour = () => {
    const now = new Date()

    now.setMinutes(0, 0, 0)
    now.setHours(now.getHours() + 1)

    return now
  }

  const [businessLocation, setBusinessLocation] = useState('')
  const [businessHours, setBusinessHours] = useState({})

  const defaultState = {
    clientId: client ? client.id : null,
    clientName: client ? client.full_name : '',
    startTime: getNextNearestHour(),
    endTime: new Date(getNextNearestHour().getTime() + 60 * 60 * 1000), // 1 hour later
    location: businessLocation,
    appointmentType: 'general',
    notes: '',
    sendEmail: false,
    sendSms: false,
    appointmentDate: selectedDate || new Date()
  }

  const [values, setValues] = useState(defaultState)
  const [isLoading, setIsLoading] = useState(false)
  const [clientError, setClientError] = useState('')
  const [timeError, setTimeError] = useState('')
  const [timeWarning, setTimeWarning] = useState('')
  const [isOutsideBusinessHours, setIsOutsideBusinessHours] = useState(false)

  const { handleSubmit } = useForm()

  useEffect(() => {
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    // Create a new Date instance to avoid mutating selectedDate
    const selected = new Date(selectedDate || new Date())

    selected.setHours(0, 0, 0, 0)

    // Check if selectedDate is before today
    const appointmentDate = selected < today ? today : selected

    setValues(prevValues => ({
      ...prevValues,
      appointmentDate
    }))
  }, [selectedDate])

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        const data = await getBusinessInfo()

        if (data.is_meeting_location) {
          const addressParts = [
            data.address_line_1,
            data.address_line_2,
            data.city,
            data.state_province_region,
            data.postal_code,
            data.country
          ].filter(part => part)

          const fullAddress = addressParts.join(', ')

          // Only update if the address has changed
          setBusinessLocation(prevLocation => (prevLocation !== fullAddress ? fullAddress : prevLocation))

          // Update the location in values if it's empty or matches previous businessLocation
          setValues(prevValues => ({
            ...prevValues,
            location:
              prevValues.location === '' || prevValues.location === prevValues.businessLocation
                ? fullAddress
                : prevValues.location
          }))
        }

        // Set business hours in state
        setBusinessHours(data.business_hours)
      } catch (error) {
        console.error('Error fetching business info:', error)
      }
    }

    fetchBusinessInfo()
  }, [])

  const handleModalClose = () => {
    setValues({
      ...defaultState,
      appointmentDate: selectedDate || new Date()
    })
    setTimeError('')
    setTimeWarning('')
    handleAddEventModalToggle()
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
    // Reset time error before validation
    setTimeError('')

    // Validate that startTime and endTime are not equal
    if (values.startTime.getTime() === values.endTime.getTime()) {
      setTimeError('Start time cannot be equal to end time.')

      return
    }

    if (!values.clientId) {
      setClientError('Please select a client before scheduling the appointment.')

      return
    }

    setClientError('')
    setIsLoading(true)

    try {
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

      await addAppointment(
        newAppointment.clientId,
        newAppointment.userId,
        newAppointment.startTime,
        newAppointment.endTime,
        newAppointment.location,
        newAppointment.status,
        newAppointment.type,
        newAppointment.notes,
        newAppointment.sendEmail,
        newAppointment.sendSms
      )

      // Trigger SWR revalidation by calling mutate without data
      const todayFormatted = format(new Date(), 'yyyy-MM-dd')

      mutate(['appointments', todayFormatted])
      mutateAppointments()
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

    setValues(prevValues => ({
      ...prevValues,
      startTime: newStartTime
    }))
  }

  const handleEndTimeChange = date => {
    const newEndTime = new Date(date)

    setValues(prevValues => ({
      ...prevValues,
      endTime: newEndTime
    }))
  }

  // UseEffect to handle time validation and warnings
  useEffect(() => {
    if (values.startTime && values.endTime) {
      if (values.endTime.getTime() === values.startTime.getTime()) {
        setTimeError('Start time cannot be equal to end time.')
        setTimeWarning('')
      } else {
        setTimeError('')

        if (values.endTime.getTime() < values.startTime.getTime()) {
          setTimeWarning('End time spans across midnight. Did you mean to do this?')
        } else {
          setTimeWarning('')
        }
      }
    }
  }, [values.startTime, values.endTime])

  // Function to check if appointment is outside business hours
  function isAppointmentOutsideBusinessHours(appointmentDate, startTime, endTime, businessHours) {
    // Get the day of the week as a lowercase string, e.g., 'monday'
    let dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()

    let appointmentStartDateTime = combineDateAndTime(appointmentDate, startTime)
    let appointmentEndDateTime = combineDateAndTime(appointmentDate, endTime)

    // If end time is before start time, assume it's for the next day
    if (appointmentEndDateTime < appointmentStartDateTime) {
      appointmentEndDateTime.setDate(appointmentEndDateTime.getDate() + 1)
    }

    let isWithinBusinessHours = false

    // Function to check if time range is within business hours of a day
    const isWithinDayBusinessHours = (date, startDateTime, endDateTime) => {
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
      const dayHours = businessHours[dayOfWeek]

      if (!dayHours || dayHours === 'Closed' || dayHours.length === 0) {
        return false
      }

      for (const interval of dayHours) {
        const [openHour, openMinute] = interval.open.split(':').map(Number)
        const [closeHour, closeMinute] = interval.close.split(':').map(Number)
        const openDateTime = new Date(date)

        openDateTime.setHours(openHour, openMinute, 0, 0)
        const closeDateTime = new Date(date)

        closeDateTime.setHours(closeHour, closeMinute, 0, 0)

        if (startDateTime >= openDateTime && endDateTime <= closeDateTime) {
          return true
        }
      }

      return false
    }

    if (appointmentStartDateTime.toDateString() === appointmentEndDateTime.toDateString()) {
      // Appointment is on the same day
      isWithinBusinessHours = isWithinDayBusinessHours(
        appointmentDate,
        appointmentStartDateTime,
        appointmentEndDateTime
      )
    } else {
      // Appointment spans multiple days
      const isWithinStartDay = isWithinDayBusinessHours(
        appointmentStartDateTime,
        appointmentStartDateTime,
        new Date(appointmentStartDateTime).setHours(23, 59, 59, 999)
      )

      const isWithinEndDay = isWithinDayBusinessHours(
        appointmentEndDateTime,
        new Date(appointmentEndDateTime).setHours(0, 0, 0, 0),
        appointmentEndDateTime
      )

      isWithinBusinessHours = isWithinStartDay && isWithinEndDay
    }

    return !isWithinBusinessHours
  }

  useEffect(() => {
    if (businessHours && values.appointmentDate && values.startTime && values.endTime) {
      const outsideBusinessHours = isAppointmentOutsideBusinessHours(
        values.appointmentDate,
        values.startTime,
        values.endTime,
        businessHours
      )

      setIsOutsideBusinessHours(outsideBusinessHours)
    } else {
      setIsOutsideBusinessHours(false)
    }
  }, [values.appointmentDate, values.startTime, values.endTime, businessHours])

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
          {/* Conditional Rendering: Show Typography with Avatar if client is passed, else show ClientSearch */}
          {client ? (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography
                variant='h6'
                component='div'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <InitialsAvatar
                  fullName={values.clientName}
                  sx={{
                    mr: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 40,
                    height: 40,
                    fontSize: 16
                  }}
                />
                <span
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                >
                  {values.clientName}
                </span>
              </Typography>
            </Box>
          ) : (
            <FormControl fullWidth margin='normal' style={{ marginBottom: '16px' }}>
              <ClientSearch userId={userId} onClientSelect={handleClientSelect} />
              {clientError && (
                <Typography color='error' variant='caption' style={{ marginTop: '8px' }}>
                  {clientError}
                </Typography>
              )}
            </FormControl>
          )}

          {/* Appointment Date Picker */}
          <FormControl fullWidth margin='normal' style={{ marginBottom: '16px' }}>
            <AppReactDatepicker
              selected={values.appointmentDate}
              onChange={date => setValues({ ...values, appointmentDate: date })}
              customInput={<DatePickerInput label='Appointment Date' dateFormat='EEEE, MMMM d, yyyy' />}
              minDate={new Date()}
            />
          </FormControl>

          <Grid container spacing={2} style={{ marginTop: '0' }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePickerComponent
                    label='Start Time'
                    value={values.startTime}
                    onChange={handleStartTimeChange}
                    minutesStep={5}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePickerComponent
                    label='End Time'
                    value={values.endTime}
                    onChange={handleEndTimeChange}
                    minutesStep={5}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          </Grid>

          {/* Display Time Validation Error */}
          {timeError && (
            <Box sx={{ mt: 1 }}>
              <Typography variant='body2' color='error'>
                {timeError}
              </Typography>
            </Box>
          )}

          {/* Display Time Warning */}
          {timeWarning && (
            <Box sx={{ mt: 1 }}>
              <Typography variant='body2' color='warning.main'>
                {timeWarning}
              </Typography>
            </Box>
          )}

          {/* Display Outside Business Hours Notification */}
          {isOutsideBusinessHours && (
            <Box sx={{ mt: 1 }}>
              <Typography variant='body2' color='warning.main'>
                Appointment is outside of shop hours
              </Typography>
            </Box>
          )}

          <FormControl fullWidth margin='normal'>
            <TextField
              label='Appointment Address'
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
