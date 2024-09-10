'use client'

import React, { useState, useCallback } from 'react'

import { Button, CircularProgress, Box, Typography } from '@mui/material'

import CalendarApp from '@/components/CalendarApp'

const AppointmentsDashboard = () => {
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)

  const handleAddEventModalToggle = useCallback(() => {
    setAddEventModalOpen(prevState => !prevState)
  }, [])

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
        <h1>Appointments</h1>
        <Button variant='contained' onClick={handleAddEventModalToggle}>
          Add Appointment
        </Button>
      </Box>
      <CalendarApp addEventModalOpen={addEventModalOpen} handleAddEventModalToggle={handleAddEventModalToggle} />
    </>
  )
}

export default AppointmentsDashboard
