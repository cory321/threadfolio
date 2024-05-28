'use client'

import GarmentEntryForm from '@components/garments/GarmentEntryForm'

export default function CreateServiceOrderPage() {
  return (
    <>
      <h1>Create Service Order</h1>
      <br />
      <br />
      <br />
      <h2>Client lookup</h2>
      <p>client lookup or add new client</p>
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
