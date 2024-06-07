'use client'

import React, { useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@components/garments/garment-service-table/ServiceLookup' // Adjust the path as needed

function GarmentEntryForm() {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [stage, setStage] = useState('not started')
  const [instructions, setInstructions] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [isEvent, setIsEvent] = useState(false)
  const [eventDate, setEventDate] = useState(null)

  const handleImageUpload = event => {
    setImage(event.target.files[0])
  }

  const handleSubmit = event => {
    event.preventDefault()

    // Handle form submission
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <Typography variant='h6' gutterBottom>
        Add Garment
      </Typography>
      <TextField fullWidth label='Garment Name' value={name} onChange={e => setName(e.target.value)} margin='normal' />

      <ServiceLookup />
      <TextField
        fullWidth
        label='Instructions and Notes'
        multiline
        rows={4}
        value={instructions}
        onChange={e => setInstructions(e.target.value)}
        margin='normal'
      />
      <AppReactDatepicker
        selected={dueDate}
        onChange={date => setDueDate(date)}
        customInput={<DatePickerInput label='Due Date' dateFormat='EEEE, MMMM d, yyyy' />}
      />
      <FormControlLabel
        control={<Checkbox checked={isEvent} onChange={() => setIsEvent(!isEvent)} />}
        label='For Event'
      />
      {isEvent && (
        <AppReactDatepicker
          selected={eventDate}
          onChange={date => setEventDate(date)}
          customInput={<DatePickerInput label='Event Date' dateFormat='EEEE, MMMM d, yyyy' />}
        />
      )}

      <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
        Add Garment
      </Button>
    </Box>
  )
}

export default GarmentEntryForm
