'use client'

import { useState, useEffect, Suspense } from 'react'

import { CircularProgress } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import AddServiceForm from '@/components/services/AddServiceForm'
import ServiceList from '@/components/services/ServiceList'
import { fetchAllServices } from '@/app/actions/services'

export default function Home() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
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

  return (
    <main>
      <div>
        <h2>Service Catalog</h2>
        <AddServiceForm setServices={setServices} />
        {loading ? (
          <CircularProgress />
        ) : (
          <Suspense fallback={<CircularProgress />}>
            <ServiceList services={services} setServices={setServices} />
          </Suspense>
        )}
      </div>
    </main>
  )
}
