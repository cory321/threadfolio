'use client'

import { Suspense } from 'react'

import { CircularProgress } from '@mui/material'

import ServiceListContent from './ServiceListContent'

const ServiceList = ({ services, setServices }) => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ServiceListContent services={services} setServices={setServices} />
    </Suspense>
  )
}

export default ServiceList
