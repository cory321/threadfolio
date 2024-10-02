'use client'

import { Suspense } from 'react'

import { CircularProgress, Grid, Box } from '@mui/material'

import ClientDashboard from '@/components/clients/ClientDashboard'

export default function ClientsPage() {
  return (
    <main>
      <Suspense fallback={<CircularProgress />}>
        <ClientDashboard />
      </Suspense>
    </main>
  )
}
