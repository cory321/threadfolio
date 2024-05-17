import React, { forwardRef } from 'react'

import TextField from '@mui/material/TextField'
import { format, isValid, parse } from 'date-fns'

// Define the input format for dates and times
const dateInputFormat = 'MM/dd/yyyy'
const timeInputFormat = 'h:mm aa'

const DatePickerInput = forwardRef(({ label, value, onClick, dateFormat }, ref) => {
  let dateValue

  if (typeof value === 'string') {
    // Parse date and time strings into Date objects
    try {
      if (dateFormat === 'h:mm aa') {
        dateValue = parse(value, timeInputFormat, new Date())
      } else {
        dateValue = parse(value, dateInputFormat, new Date())
      }
    } catch (error) {
      console.error('Error parsing date:', error)
      dateValue = null
    }
  } else {
    dateValue = value
  }

  // Ensure value is a valid Date object before formatting
  const formattedDate = dateValue && isValid(dateValue) ? format(dateValue, dateFormat) : ''

  return (
    <TextField
      ref={ref}
      label={label}
      value={formattedDate}
      onClick={onClick}
      fullWidth
      variant='outlined'
      InputProps={{
        readOnly: true
      }}
    />
  )
})

export default DatePickerInput
