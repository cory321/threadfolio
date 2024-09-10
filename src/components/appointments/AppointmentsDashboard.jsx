'use client'

import React, { useState, useCallback } from 'react'

import { Button, CircularProgress } from '@mui/material'

import CalendarApp from '@/components/CalendarApp'

const AppointmentsDashboard = () => {
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)

  const handleAddEventModalToggle = useCallback(() => {
    setAddEventModalOpen(prevState => !prevState)
  }, [])

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddEventModalToggle}>
          Add Appointment
        </Button>
      </div>
      <CalendarApp addEventModalOpen={addEventModalOpen} handleAddEventModalToggle={handleAddEventModalToggle} />
    </>
  )
}

export default AppointmentsDashboard
