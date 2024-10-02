import React, { useContext, useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Step1ClientSelection from './Step1ClientSelection'
import Step2GarmentDetails from './Step2GarmentDetails'
import Step3Summary from './Step3Summary'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'
import { addGarmentsAndServicesFromContext } from '@actions/garments'

const StepContent = ({
  step,
  userId,
  handleClientSubmit,
  handleGarmentSubmit,
  handleSummarySubmit,
  handleBack,
  onSubmit,
  steps
}) => {
  const {
    selectedClient,
    setSelectedClient,
    garmentDetails,
    setGarmentDetails,
    services,
    setServices,
    orderId,
    setOrderId,
    garments,
    setGarments
  } = useContext(GarmentServiceOrderContext)

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target

    setGarmentDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleGarmentSave = () => {
    const newGarment = {
      user_id: userId,
      client_id: selectedClient.id,
      name: garmentDetails.name,
      image_cloud_id: garmentDetails.image_cloud_id,
      stage: 'not started', // assuming 'not started' as a default stage, modify as needed
      notes: garmentDetails.instructions,
      due_date: garmentDetails.dueDate,
      is_event: garmentDetails.isEvent,
      event_date: garmentDetails.eventDate,
      services: services.map(service => ({
        name: service.name,
        description: service.description,
        qty: service.qty,
        unit_price: service.unit_price,
        unit: service.unit
      }))
    }

    // Add the new garment to the garments state, including services
    setGarments(prevGarments => [...prevGarments, { ...newGarment }])

    // Clear services table
    setServices([])

    // Clear garment details form
    setGarmentDetails({
      name: '',
      image_cloud_id: '',
      instructions: '',
      dueDate: null,
      isEvent: false,
      eventDate: null,
      image_metadata: { width: 0, height: 0 } // Reset image metadata
    })

    handleDialogClose()
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)

    try {
      const result = await addGarmentsAndServicesFromContext(userId, selectedClient, garments)

      console.log('Saved successfully:', result)
      toast.success('Garments and services saved successfully!')

      // Clear the context or navigate to a new page
      setGarments([])
      setSelectedClient(null)
      onSubmit() // This should move to the next step or finish the process
    } catch (error) {
      console.error('Error saving garments:', error)
      toast.error('Error saving garments and services. Please try again.')
    } finally {
      setIsLoading(false)
      router.push('/orders')
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step1ClientSelection
            userId={userId}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            handleClientSubmit={handleClientSubmit}
            onSubmit={onSubmit}
          />
        )
      case 1:
        return (
          <Step2GarmentDetails
            userId={userId}
            selectedClient={selectedClient}
            garmentDetails={garmentDetails}
            setGarmentDetails={setGarmentDetails}
            garments={garments}
            setGarments={setGarments}
            handleGarmentSubmit={handleGarmentSubmit}
            handleInputChange={handleInputChange}
            handleGarmentSave={handleGarmentSave}
            handleDialogOpen={handleDialogOpen}
            handleDialogClose={handleDialogClose}
            dialogOpen={dialogOpen}
            isLoading={isLoading}
            handleBack={handleBack}
            onSubmit={onSubmit}
          />
        )
      case 2:
        return (
          <Step3Summary
            steps={steps}
            handleSummarySubmit={handleFinalSubmit}
            onSubmit={onSubmit}
            handleBack={handleBack}
            isLoading={isLoading}
          />
        )
      default:
        return <div>Unknown stepIndex</div>
    }
  }

  return renderStep()
}

export default StepContent
