import dynamic from 'next/dynamic'

import { auth } from '@clerk/nextjs/server'

import Breadcrumb from '@/components/ui/Breadcrumb'

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
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: 'Create Order', href: '/orders/create' }
        ]}
      />

      <h1>Create Service Order</h1>
      <br />
      <GarmentServiceOrderStepper userId={userId} />
    </>
  )
}

export default CreateServiceOrderPage
