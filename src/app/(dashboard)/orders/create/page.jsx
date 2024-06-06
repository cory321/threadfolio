import dynamic from 'next/dynamic'

import { auth } from '@clerk/nextjs/server'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

const GarmentServiceOrderStepper = dynamic(
  () => import('@components/garments/garment-service-stepper/GarmentServiceOrderStepper'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

const CreateServiceOrderPage = async () => {
  const { userId } = auth()

  return (
    <>
      <h1>Create Service Order</h1>
      <br />
      <GarmentServiceOrderStepper userId={userId} clientId='client321' />
    </>
  )
}

export default CreateServiceOrderPage
