import React from 'react'

import { Box, Checkbox, Typography, IconButton, Grid, Divider, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import { setHours, setMinutes } from 'date-fns'

import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const BusinessHours = ({ businessHours, setBusinessHours }) => {
  // Default open and close times: 9:00 AM and 5:00 PM
  const defaultOpenTime = setHours(setMinutes(new Date(), 0), 9)
  const defaultCloseTime = setHours(setMinutes(new Date(), 0), 17)

  // Handle changing the open status of a day
  const handleOpenChange = (dayIndex, isOpen) => {
    const updatedHours = businessHours.map((day, index) => {
      if (index === dayIndex) {
        const intervals = isOpen
          ? day.intervals && day.intervals.length > 0
            ? day.intervals
            : [{ openTime: defaultOpenTime, closeTime: defaultCloseTime }]
          : []

        return { ...day, isOpen, intervals }
      }

      return day
    })

    setBusinessHours(updatedHours)
  }

  // Add a new interval to a day
  const handleAddInterval = dayIndex => {
    const updatedHours = businessHours.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          intervals: [...day.intervals, { openTime: defaultOpenTime, closeTime: defaultCloseTime }]
        }
      }

      return day
    })

    setBusinessHours(updatedHours)
  }

  // Remove an interval from a day
  const handleRemoveInterval = (dayIndex, intervalIndex) => {
    const updatedHours = businessHours.map((day, index) => {
      if (index === dayIndex) {
        const newIntervals = day.intervals.filter((_, idx) => idx !== intervalIndex)

        if (newIntervals.length === 0) {
          // If no intervals left, uncheck the day and clear intervals
          return { ...day, isOpen: false, intervals: [] }
        }

        return { ...day, intervals: newIntervals }
      }

      return day
    })

    setBusinessHours(updatedHours)
  }

  // Handle time changes for openTime and closeTime
  const handleTimeChange = (dayIndex, intervalIndex, field, date) => {
    const updatedHours = businessHours.map((day, index) => {
      if (index === dayIndex) {
        const updatedIntervals = day.intervals.map((interval, idx) => {
          if (idx === intervalIndex) {
            return { ...interval, [field]: date }
          }

          return interval
        })

        return { ...day, intervals: updatedIntervals }
      }

      return day
    })

    setBusinessHours(updatedHours)
  }

  // Responsive adjustments
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  return (
    <Box>
      {daysOfWeek.map((day, index) => (
        <Box key={day} sx={{ mb: 2 }}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <Checkbox
                checked={businessHours[index].isOpen}
                onChange={e => handleOpenChange(index, e.target.checked)}
              />
            </Grid>
            <Grid item xs={isMobile ? 3 : 2}>
              <Typography sx={{ fontWeight: 'bold' }}>{day.slice(0, 3)}</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 9}>
              {businessHours[index].isOpen ? (
                businessHours[index].intervals.map((interval, intervalIndex) => (
                  <Grid container alignItems='center' spacing={1} key={intervalIndex} sx={{ mb: 1 }}>
                    <Grid item>
                      <AppReactDatepicker
                        selected={interval.openTime}
                        onChange={date => handleTimeChange(index, intervalIndex, 'openTime', date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat='h:mm aa'
                        customInput={<DatePickerInput dateFormat='h:mm aa' showAdornment={false} />}
                        minTime={setHours(setMinutes(new Date(), 0), 0)}
                        maxTime={setHours(setMinutes(new Date(), 45), 23)}
                        wrapperClassName='datepicker'
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ mx: 1 }}>-</Typography>
                    </Grid>
                    <Grid item>
                      <AppReactDatepicker
                        selected={interval.closeTime}
                        onChange={date => handleTimeChange(index, intervalIndex, 'closeTime', date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat='h:mm aa'
                        customInput={<DatePickerInput dateFormat='h:mm aa' showAdornment={false} />}
                        minTime={setHours(setMinutes(new Date(), 0), 0)}
                        maxTime={setHours(setMinutes(new Date(), 45), 23)}
                        wrapperClassName='datepicker'
                      />
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleRemoveInterval(index, intervalIndex)} size='small'>
                        <CloseIcon />
                      </IconButton>
                      {intervalIndex === businessHours[index].intervals.length - 1 && (
                        <IconButton onClick={() => handleAddInterval(index)} size='small'>
                          <AddIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Typography sx={{ color: 'grey.500' }}>Closed</Typography>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  )
}

export default BusinessHours
