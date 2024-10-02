'use client'

import { useState, useEffect } from 'react'

import { CircularProgress } from '@mui/material'

import { fetchAllServices } from '@/app/actions/services'
import ServiceListContent from './ServiceListContent'

const ServiceList = () => {
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
    return <CircularProgress />
  }

  return <ServiceListContent services={services} setServices={setServices} />
}

export default ServiceList
