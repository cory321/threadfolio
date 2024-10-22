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

// Import TimePicker components

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput'
import AppointmentTypeRadioIcons from './AppointmentTypeRadioIcons'
import ClientSearch from '@/components/clients/ClientSearch'
import { adjustEndTimeIfNeeded } from '@/utils/dateTimeUtils'

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
  const [timeError, setTimeError] = useState('') // New state for time validation

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
    if (values.startTime >= values.endTime) {
      setValues(prevValues => ({
        ...prevValues,
        endTime: new Date(new Date(values.startTime).getTime() + 60 * 60 * 1000) // 1 hour later
      }))
    }
  }, [values.startTime, values.endTime])

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

          setBusinessLocation(fullAddress)

          // Update the location in values if it's empty or matches previous businessLocation
          setValues(prevValues => ({
            ...prevValues,
            location:
              prevValues.location === '' || prevValues.location === businessLocation ? fullAddress : prevValues.location
          }))
        }
      } catch (error) {
        console.error('Error fetching business info:', error)
      }
    }

    fetchBusinessInfo()
  }, [businessLocation])

  const handleModalClose = () => {
    setValues({
      ...defaultState,
      appointmentDate: selectedDate || new Date()
    })
    setTimeError('') // Reset time error on modal close
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
    let newEndTime = new Date(values.endTime)

    if (newStartTime >= newEndTime) {
      newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000) // 1 hour later
    }

    setValues({
      ...values,
      startTime: newStartTime,
      endTime: newEndTime
    })

    // Reset time error if previously set
    if (timeError && newStartTime.getTime() !== values.endTime.getTime()) {
      setTimeError('')
    }
  }

  const handleEndTimeChange = date => {
    const newEndTime = adjustEndTimeIfNeeded(values.startTime, date)

    setValues({
      ...values,
      endTime: newEndTime
    })

    // Reset time error if previously set
    if (timeError && values.startTime.getTime() !== newEndTime.getTime()) {
      setTimeError('')
    }
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
          {/* Conditional Rendering: Show Typography with Avatar if client is passed, else show ClientSearch */}
          {client ? (
            <Box
              sx={{
                mb: 2,
                textAlign: 'center'
              }}
            >
              <Typography
                variant='h6'
                component='div'
                sx={{
                  display: 'flex',
                  alignItems: 'center'
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
                    minutesStep={5} // Restrict minutes to 5-minute intervals
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
                    minutesStep={5} // Restrict minutes to 5-minute intervals
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
