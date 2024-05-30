import { auth } from '@clerk/nextjs/server'

import GarmentClientLookup from '@components/garments/GarmentClientLookup'
import GarmentEntryForm from '@components/garments/GarmentEntryForm'
import StepperLinearWithValidation from '@views/form-wizard/StepperLinearWithValidation'

import ClientSearch from '@components/clients/ClientSearch'

const CreateServiceOrderPage = async () => {
  const { userId } = auth()

  return (
    <>
      <h1>Create Service Order</h1>
      <h2>Client lookup</h2>
      <StepperLinearWithValidation />
      <ClientSearch userId={userId} />
      <GarmentClientLookup />
      <br />
      <br />
      <br />
      <h2>Add garments needing service</h2>
      <ul>
        <li>Garment name</li>
        <li>Garment stage (hidden) [not started, working on it, done, stuck, archived]</li>
        <li>add garment image</li>
        <li>Add services to garment</li>
        <li>detailed instructions and notes</li>
        <li>due date</li>
        <li>is this garment for an event?</li>
        <li>if yes, add event date and event type</li>
        <li>add garment button</li>
      </ul>
      <GarmentEntryForm />
    </>
  )
}

export default CreateServiceOrderPage
