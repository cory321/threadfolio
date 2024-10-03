'use client'

import { useEffect, useState } from 'react'

import { CircularProgress, Grid, Box } from '@mui/material'

import AddServiceDialog from '@/components/dialogs/add-service'
import ServiceList from '@/components/services/ServiceList'
import { fetchAllServices } from '@/app/actions/services'

export default function ServicePage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const fetchedServices = await fetchAllServices()

        setServices(fetchedServices)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <main>
      <div>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <h1>Service Catalog</h1>
          </Grid>
          <Grid item>
            <AddServiceDialog setServices={setServices} />
          </Grid>
        </Grid>
        <Box pt={6}>
          <ServiceList services={services} setServices={setServices} />
        </Box>
      </div>
    </main>
  )
}
