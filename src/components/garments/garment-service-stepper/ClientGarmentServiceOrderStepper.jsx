'use client'

import dynamic from 'next/dynamic'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

const GarmentServiceOrderStepper = dynamic(
  () => import('@components/garments/garment-service-stepper/GarmentServiceOrderStepper'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

const ClientGarmentServiceOrderStepper = ({ userId }) => {
  return <GarmentServiceOrderStepper userId={userId} />
}

export default ClientGarmentServiceOrderStepper
