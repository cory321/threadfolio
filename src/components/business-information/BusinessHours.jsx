import React from 'react'

import { Box, Checkbox, Typography, IconButton, Grid, Divider, useMediaQuery, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import { LocalizationProvider, TimePicker, MobileTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { setHours, setMinutes, addHours } from 'date-fns'

import { daysOfWeek } from '@/utils/dateTimeUtils'

function BusinessHours({ businessHours, setBusinessHours }) {
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

  // Function to check for overlapping intervals
  const getOverlappingIntervals = intervals => {
    const overlaps = {}

    for (let i = 0; i < intervals.length; i++) {
      overlaps[i] = false

      for (let j = 0; j < intervals.length; j++) {
        if (i !== j) {
          const aStart = intervals[i].openTime
          const aEnd = intervals[i].closeTime
          const bStart = intervals[j].openTime
          const bEnd = intervals[j].closeTime

          if (aStart < bEnd && bStart < aEnd) {
            overlaps[i] = true
            break
          }
        }
      }
    }

    return overlaps
  }

  // Responsive adjustments
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // Choose TimePicker component based on screen size
  const TimePickerComponent = isMobile ? MobileTimePicker : TimePicker

  /**
   * Uncomment and use this function if you want to allow multiple intervals per day
   */
  // const handleAddInterval = dayIndex => {
  //   const updatedHours = businessHours.map((day, index) => {
  //     if (index === dayIndex) {
  //       let newOpenTime, newCloseTime

  //       if (day.intervals.length > 0) {
  //         const lastInterval = day.intervals[day.intervals.length - 1]

  //         newOpenTime = addHours(new Date(lastInterval.closeTime), 1)
  //       } else {
  //         newOpenTime = defaultOpenTime
  //       }

  //       newCloseTime = addHours(new Date(newOpenTime), 1)

  //       return {
  //         ...day,
  //         intervals: [...day.intervals, { openTime: newOpenTime, closeTime: newCloseTime }]
  //       }
  //     }

  //     return day
  //   })

  //   setBusinessHours(updatedHours)
  // }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {daysOfWeek.map((day, index) => (
          <Box key={day} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems='flex-start'>
              {/* Left Column: Checkbox and Day Name */}
              <Grid item xs={isMobile ? 3 : 2} alignSelf='flex-start'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={businessHours[index].isOpen}
                    onChange={e => handleOpenChange(index, e.target.checked)}
                  />
                  <Typography sx={{ fontWeight: 'bold' }}>{day.slice(0, 3)}</Typography>
                </Box>
              </Grid>

              {/* Right Column: Intervals */}
              <Grid item xs={isMobile ? 12 : 10}>
                {businessHours[index].isOpen ? (
                  (() => {
                    const overlaps = getOverlappingIntervals(businessHours[index].intervals)

                    return businessHours[index].intervals.map((interval, intervalIndex) => (
                      <Grid container alignItems='center' spacing={1} key={intervalIndex} sx={{ mb: 1 }}>
                        <Grid item>
                          <TimePickerComponent
                            label='Open'
                            value={interval.openTime}
                            onChange={date => handleTimeChange(index, intervalIndex, 'openTime', date)}
                            minutesStep={5} // Restrict minutes to 5-minute intervals
                            renderInput={params => (
                              <TextField
                                {...params}
                                variant='outlined'
                                size='small'
                                error={overlaps[intervalIndex]}
                                sx={{
                                  width: 100,
                                  ...(overlaps[intervalIndex] && {
                                    '& .MuiOutlinedInput-root fieldset': {
                                      borderColor: 'error.main'
                                    }
                                  })
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item>
                          <Typography sx={{ mx: 1 }}>-</Typography>
                        </Grid>
                        <Grid item>
                          <TimePickerComponent
                            label='Close'
                            value={interval.closeTime}
                            onChange={date => handleTimeChange(index, intervalIndex, 'closeTime', date)}
                            minutesStep={5} // Restrict minutes to 5-minute intervals
                            renderInput={params => (
                              <TextField
                                {...params}
                                variant='outlined'
                                size='small'
                                error={overlaps[intervalIndex]}
                                sx={{
                                  width: 100,
                                  ...(overlaps[intervalIndex] && {
                                    '& .MuiOutlinedInput-root fieldset': {
                                      borderColor: 'error.main'
                                    }
                                  })
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item>
                          <IconButton onClick={() => handleRemoveInterval(index, intervalIndex)} size='small'>
                            <CloseIcon />
                          </IconButton>
                          {/* Uncomment the following block to enable adding intervals */}
                          {/* {intervalIndex === businessHours[index].intervals.length - 1 && (
                            <IconButton onClick={() => handleAddInterval(index)} size='small'>
                              <AddIcon />
                            </IconButton>
                          )} */}
                        </Grid>
                        {overlaps[intervalIndex] && (
                          <Grid item xs={12}>
                            <Typography variant='body2' color='error'>
                              Times overlap with another set of times.
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    ))
                  })()
                ) : (
                  <Box sx={{ pt: 1 }}>
                    <Typography sx={{ color: 'grey.500' }}>Closed</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
    </LocalizationProvider>
  )
}

export default BusinessHours
