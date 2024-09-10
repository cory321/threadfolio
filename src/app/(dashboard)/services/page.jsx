'use client'

import { Suspense } from 'react'

import { CircularProgress, Button, Grid, Box } from '@mui/material'

import AddServiceDialog from '@/components/dialogs/add-service'
import ServiceList from '@/components/services/ServiceList'
import { fetchAllServices } from '@/app/actions/services'

export default async function ServicePage() {
  return (
    <main>
      <div>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <h1>Service Catalog</h1>
          </Grid>
          <Grid item>
            <AddServiceDialog />
          </Grid>
        </Grid>
        <Box pt={6}>
          <Suspense fallback={<CircularProgress />}>
            <ServiceList />
          </Suspense>
        </Box>
      </div>
    </main>
  )
}
