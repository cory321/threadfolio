'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { useAuth } from '@clerk/nextjs'
import { CircularProgress, Box } from '@mui/material'

import Breadcrumb from '@/components/ui/Breadcrumb'

const ClientGarmentServiceOrderStepper = dynamic(
  () => import('@/components/garments/garment-service-stepper/ClientGarmentServiceOrderStepper'),
  {
    loading: () => <CircularProgress />,
    ssr: false
  }
)

const CreateServiceOrderPage = () => {
  const { userId } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: 'Create Order', href: '/orders/create' }
        ]}
      />

      <h1>Create Service Order</h1>
      <br />
      {userId && <ClientGarmentServiceOrderStepper userId={userId} />}
    </>
  )
}

export default CreateServiceOrderPage
