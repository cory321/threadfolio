'use client'

import { useState, useEffect, Suspense } from 'react'

import { CircularProgress, Button, Grid, Box } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import AddServiceDialog from '@/components/dialogs/add-service'
import ServiceList from '@/components/services/ServiceList'
import { fetchAllServices } from '@/app/actions/services'

export default function ServicePage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const { getToken } = useAuth()

  useEffect(() => {
    const loadServices = async () => {
      try {
        const token = await getToken({ template: 'supabase' })
        const services = await fetchAllServices(token)

        setServices(services)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [getToken])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <main>
      <div>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <h1>Service Catalog</h1>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={handleOpen}>
              Add Service
            </Button>
          </Grid>
        </Grid>
        <Box pt={6}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Suspense fallback={<CircularProgress />}>
              <ServiceList services={services} setServices={setServices} />
            </Suspense>
          )}
        </Box>
        <AddServiceDialog open={open} handleClose={handleClose} setServices={setServices} />
      </div>
    </main>
  )
}
