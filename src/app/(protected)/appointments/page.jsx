'use client'

import { Suspense } from 'react'

import { CircularProgress, Grid, Box } from '@mui/material'

import AppointmentsDashboard from '@/components/appointments/AppointmentsDashboard'

export default function AppointmentsPage() {
  return (
    <main>
      <Suspense fallback={<CircularProgress />}>
        <AppointmentsDashboard />
      </Suspense>
    </main>
  )
}
