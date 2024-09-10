import { auth } from '@clerk/nextjs/server'

import Breadcrumb from '@/components/ui/Breadcrumb'
import ClientGarmentServiceOrderStepper from '@/components/garments/garment-service-stepper/ClientGarmentServiceOrderStepper'

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
      <ClientGarmentServiceOrderStepper userId={userId} />
    </>
  )
}

export default CreateServiceOrderPage
