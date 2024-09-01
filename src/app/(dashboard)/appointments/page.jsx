'use client'

import { useState } from 'react'

import { Button } from '@mui/material'

import CalendarApp from '../../apps/calendar/page'

export default function AppointmentsPage() {
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)

  const handleAddEventModalToggle = () => {
    setAddEventModalOpen(!addEventModalOpen)
  }

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1>Appointments</h1>
        <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddEventModalToggle}>
          Add Appointment
        </Button>
      </div>
      <CalendarApp addEventModalOpen={addEventModalOpen} handleAddEventModalToggle={handleAddEventModalToggle} />
    </>
  )
}
