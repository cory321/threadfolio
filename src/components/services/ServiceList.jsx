'use client'

import { CircularProgress, Box } from '@mui/material'

import ServiceListContent from './ServiceListContent'

const ServiceList = ({ services, setServices }) => {
  if (!services) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <CircularProgress />
      </Box>
    )
  }

  return <ServiceListContent services={services} setServices={setServices} />
}

export default ServiceList
