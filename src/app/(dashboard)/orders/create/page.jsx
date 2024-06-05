import { auth } from '@clerk/nextjs/server'

import GarmentServiceOrderStepper from '@components/garments/garment-service-stepper/GarmentServiceOrderStepper'

const CreateServiceOrderPage = async () => {
  const { userId } = auth()

  return (
    <>
      <h1>Create Service Order</h1>
      <br />
      <GarmentServiceOrderStepper userId={userId} />
    </>
  )
}

export default CreateServiceOrderPage
