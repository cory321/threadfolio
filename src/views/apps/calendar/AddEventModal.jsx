import React, { useState, useEffect } from 'react'

// MUI Imports
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  useMediaQuery,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  Grid
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

// Custom Datepicker Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from './DatePickerInput' // Custom Input Component

// Default State
const defaultState = {
  clientName: '',
  clientId: null,
  appointmentDate: new Date(), // Initialize with a Date object
  startTime: new Date(), // Initialize with a Date object
  endTime: new Date(), // Initialize with a Date object
  location: 'Default Seamstress Shop Location',
  appointmentType: 'general',
  notes: '',
  sendConfirmation: false
}

const AddAppointmentModal = props => {
  const { addEventModalOpen, handleAddEventModalToggle, handleAddAppointment } = props

  const [values, setValues] = useState(defaultState)
  const [clientList, setClientList] = useState([])
  const [showNewClientPopup, setShowNewClientPopup] = useState(false)

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const fetchClients = clientName => {
    if (clientName) {
      axios.get(`/api/clients?search=${clientName}`).then(response => {
        setClientList(response.data)
      })
    }
  }

  const handleClientSelect = client => {
    setValues({ ...values, clientName: client.name, clientId: client.id })
    setClientList([])
  }

  const handleAddNewClient = () => {
    // Logic to add a new client
    setShowNewClientPopup(true)
  }

  const handleModalClose = () => {
    setValues(defaultState)
    handleAddEventModalToggle()
  }

  const onSubmit = data => {
    const newAppointment = {
      ...values,
      appointmentDate: values.appointmentDate,
      startTime: values.startTime,
      endTime: values.endTime,
      location: values.location,
      appointmentType: values.appointmentType,
      notes: values.notes,
      sendConfirmation: values.sendConfirmation
    }

    handleAddAppointment(newAppointment)
    handleModalClose()
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
          {/* Client Lookup */}
          <FormControl fullWidth margin='normal'>
            <InputLabel>Client Name</InputLabel>
            <TextField
              value={values.clientName}
              onChange={e => {
                setValues({ ...values, clientName: e.target.value })
                fetchClients(e.target.value)
              }}
              onBlur={() => setClientList([])}
            />
            {clientList.length > 0 && (
              <ul>
                {clientList.map(client => (
                  <li key={client.id} onClick={() => handleClientSelect(client)}>
                    {client.name}
                  </li>
                ))}
              </ul>
            )}
            <Button type='button' onClick={handleAddNewClient}>
              Add New Client
            </Button>
            {showNewClientPopup && (
              <div className='new-client-popup'>
                {/* New Client Form or Popup Logic */}
                <Button onClick={() => setShowNewClientPopup(false)}>Close</Button>
              </div>
            )}
          </FormControl>

          {/* Date and Time Selection */}
          <FormControl fullWidth margin='normal'>
            <AppReactDatepicker
              selected={values.appointmentDate}
              onChange={date => setValues({ ...values, appointmentDate: date })}
              customInput={<DatePickerInput label='Appointment Date' dateFormat='EEEE, MMMM d, yyyy' />}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
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
          </FormControl>
          <FormControl fullWidth margin='normal'>
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

          {/* Location Field */}
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Location'
              value={values.location}
              onChange={e => setValues({ ...values, location: e.target.value })}
            />
          </FormControl>

          {/* Appointment Type Selection */}
          <FormControl fullWidth margin='normal'>
            <InputLabel>Appointment Type</InputLabel>
            <Select
              value={values.appointmentType}
              onChange={e => setValues({ ...values, appointmentType: e.target.value })}
            >
              <MenuItem value='initial consultation'>Initial Consultation</MenuItem>
              <MenuItem value='order pickup'>Order Pickup</MenuItem>
              <MenuItem value='general'>General</MenuItem>
            </Select>
          </FormControl>

          {/* Notes Section */}
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Notes'
              multiline
              rows={4}
              value={values.notes}
              onChange={e => setValues({ ...values, notes: e.target.value })}
            />
          </FormControl>

          {/* Confirmation Email Option */}
          <FormControlLabel
            control={
              <Switch
                checked={values.sendConfirmation}
                onChange={e => setValues({ ...values, sendConfirmation: e.target.checked })}
              />
            }
            label='Send Confirmation Email'
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
          Schedule
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleModalClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAppointmentModal
