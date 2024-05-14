import React, { useState, useEffect, forwardRef, useCallback } from 'react'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  Switch,
  Button,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  useMediaQuery,
  FormControl,
  FormControlLabel
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Helper Functions
const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const AddEventModal = props => {
  const {
    calendars,
    calendarApi,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleSelectEvent,
    addEventModalOpen,
    handleAddEventModalToggle
  } = props

  const [values, setValues] = useState(defaultState)

  const PickersComponent = forwardRef((props, ref) => (
    <TextField inputRef={ref} fullWidth {...props} label={props.label || ''} className='is-full' error={props.error} />
  ))

  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const resetToStoredValues = useCallback(() => {
    if (calendars.selectedEvent !== null) {
      const event = calendars.selectedEvent

      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    }
  }, [setValue, calendars.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  const handleModalClose = async () => {
    setValues(defaultState)
    clearErrors()
    handleSelectEvent(null)
    handleAddEventModalToggle()
  }

  const onSubmit = data => {
    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description.length ? values.description : undefined
      }
    }

    if (
      calendars.selectedEvent === null ||
      (calendars.selectedEvent !== null && !calendars.selectedEvent.title.length)
    ) {
      handleAddEvent(modifiedEvent)
    } else {
      handleUpdateEvent({ id: parseInt(calendars.selectedEvent.id), ...modifiedEvent })
    }

    calendarApi.refetchEvents()
    handleModalClose()
  }

  const handleDeleteButtonClick = () => {
    if (calendars.selectedEvent) {
      handleDeleteEvent(parseInt(calendars.selectedEvent.id))
    }

    calendarApi.getEventById(calendars.selectedEvent.id).remove()
    handleModalClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const RenderModalFooter = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button type='submit' variant='contained'>
        {calendars.selectedEvent === null || (calendars.selectedEvent && !calendars.selectedEvent.title.length)
          ? 'Add'
          : 'Update'}
      </Button>
      <Button variant='outlined' color='secondary' onClick={resetToStoredValues}>
        Reset
      </Button>
      <Button variant='outlined' color='primary' onClick={handleModalClose}>
        Cancel
      </Button>
    </Box>
  )

  useEffect(() => {
    if (calendars.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventModalOpen, resetToStoredValues, resetToEmptyValues, calendars.selectedEvent])

  return (
    <Dialog
      open={addEventModalOpen}
      onClose={handleModalClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        {calendars.selectedEvent && calendars.selectedEvent.title.length ? 'Update Appointment' : 'Add Appointment'}
        {calendars.selectedEvent && calendars.selectedEvent.title.length && (
          <IconButton onClick={handleDeleteButtonClick} size='small'>
            <i className='ri-delete-bin-7-line text-xl' />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <FormControl fullWidth margin='normal'>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Title'
                  value={value}
                  onChange={onChange}
                  error={!!errors.title}
                  helperText={errors.title ? 'This field is required' : ''}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <InputLabel id='event-calendar'>Calendar</InputLabel>
            <Select
              label='Calendar'
              value={values.calendar}
              labelId='event-calendar'
              onChange={e => setValues({ ...values, calendar: e.target.value })}
            >
              <MenuItem value='Personal'>Personal</MenuItem>
              <MenuItem value='Business'>Business</MenuItem>
              <MenuItem value='Family'>Family</MenuItem>
              <MenuItem value='Holiday'>Holiday</MenuItem>
              <MenuItem value='ETC'>ETC</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <AppReactDatepicker
              selectsStart
              id='event-start-date'
              endDate={values.endDate}
              selected={values.startDate}
              startDate={values.startDate}
              showTimeSelect={!values.allDay}
              dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
              customInput={<PickersComponent label='Start Date' />}
              onChange={date => setValues({ ...values, startDate: new Date(date) })}
              onSelect={handleStartDate}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <AppReactDatepicker
              selectsEnd
              id='event-end-date'
              endDate={values.endDate}
              selected={values.endDate}
              minDate={values.startDate}
              startDate={values.startDate}
              showTimeSelect={!values.allDay}
              dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
              customInput={<PickersComponent label='End Date' />}
              onChange={date => setValues({ ...values, endDate: new Date(date) })}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
            }
            label='All Day'
          />
          <TextField
            fullWidth
            type='url'
            id='event-url'
            label='Event URL'
            value={values.url}
            onChange={e => setValues({ ...values, url: e.target.value })}
            margin='normal'
          />
          <FormControl fullWidth margin='normal'>
            <InputLabel id='event-guests'>Guests</InputLabel>
            <Select
              multiple
              label='Guests'
              value={values.guests}
              labelId='event-guests'
              onChange={e => setValues({ ...values, guests: e.target.value })}
            >
              <MenuItem value='bruce'>Bruce</MenuItem>
              <MenuItem value='clark'>Clark</MenuItem>
              <MenuItem value='diana'>Diana</MenuItem>
              <MenuItem value='john'>John</MenuItem>
              <MenuItem value='barry'>Barry</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            rows={4}
            multiline
            label='Description'
            id='event-description'
            value={values.description}
            onChange={e => setValues({ ...values, description: e.target.value })}
            margin='normal'
          />
        </form>
      </DialogContent>
      <DialogActions>
        <RenderModalFooter />
      </DialogActions>
    </Dialog>
  )
}

export default AddEventModal
