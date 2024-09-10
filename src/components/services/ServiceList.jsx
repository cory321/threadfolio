'use client'

import { useState, useEffect } from 'react'

import { useAuth } from '@clerk/nextjs'
import { CircularProgress } from '@mui/material'

import { fetchAllServices } from '@/app/actions/services'
import ServiceListContent from './ServiceListContent'

const ServiceList = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    const loadServices = async () => {
      try {
        const token = await getToken({ template: 'supabase' })
        const fetchedServices = await fetchAllServices(token)

        setServices(fetchedServices)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [getToken])

  if (loading) {
    return <CircularProgress />
  }

  return <ServiceListContent services={services} setServices={setServices} />
}

export default ServiceList
