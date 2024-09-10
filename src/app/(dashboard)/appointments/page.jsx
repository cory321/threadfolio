'use client'

import { Suspense } from 'react'

import { CircularProgress, Grid, Box } from '@mui/material'

import AppointmentsDashboard from '@/components/appointments/AppointmentsDashboard'

export default function AppointmentsPage() {
  return (
    <main>
      <div>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <h1>Appointments</h1>
          </Grid>
        </Grid>
        <Box pt={6}>
          <Suspense fallback={<CircularProgress />}>
            <AppointmentsDashboard />
          </Suspense>
        </Box>
      </div>
    </main>
  )
}
