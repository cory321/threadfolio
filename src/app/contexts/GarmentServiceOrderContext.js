'use client'

import React, { createContext, useState, useMemo } from 'react'

export const GarmentServiceOrderContext = createContext()

export const GarmentServiceOrderProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedClient, setSelectedClient] = useState(null)

  const [garmentDetails, setGarmentDetails] = useState({
    name: '',
    instructions: '',
    dueDate: null,
    isEvent: false,
    eventDate: null,
    image_cloud_id: '',
    image_metadata: { width: 0, height: 0 }
  })

  const [services, setServices] = useState([])
  const [orderId, setOrderId] = useState(null)

  const value = useMemo(
    () => ({
      activeStep,
      setActiveStep,
      selectedClient,
      setSelectedClient,
      garmentDetails,
      setGarmentDetails,
      services,
      setServices,
      orderId,
      setOrderId
    }),
    [activeStep, selectedClient, garmentDetails, services, orderId]
  )

  return <GarmentServiceOrderContext.Provider value={value}>{children}</GarmentServiceOrderContext.Provider>
}
