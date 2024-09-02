'use client'

import { useState } from 'react'

import CalendarApp from '@/components/CalendarApp'

export default function CalendarPage() {
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)

  const handleAddEventModalToggle = () => {
    setAddEventModalOpen(!addEventModalOpen)
  }

  return <CalendarApp addEventModalOpen={addEventModalOpen} handleAddEventModalToggle={handleAddEventModalToggle} />
}
