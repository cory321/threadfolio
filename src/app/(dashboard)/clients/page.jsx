'use client'

import { Suspense } from 'react'

import { CircularProgress, Grid, Box } from '@mui/material'

import ClientDashboard from '@/components/clients/ClientDashboard'

export default function ClientsPage() {
  return (
    <main>
      <div>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <h1>Clients</h1>
          </Grid>
        </Grid>
        <Box pt={6}>
          <Suspense fallback={<CircularProgress />}>
            <ClientDashboard />
          </Suspense>
        </Box>
      </div>
    </main>
  )
}
