'use client'
import React, { createContext, useState, useMemo, useEffect } from 'react'

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
  const [garments, setGarments] = useState([])

  useEffect(() => {
    const storedClient = localStorage.getItem('selectedClient')
    const storedGarments = localStorage.getItem('garments')

    if (storedClient) {
      setSelectedClient(JSON.parse(storedClient))
    }

    if (storedGarments) {
      setGarments(JSON.parse(storedGarments))
    }
  }, [])

  useEffect(() => {
    if (selectedClient) {
      localStorage.setItem('selectedClient', JSON.stringify(selectedClient))
    } else {
      localStorage.removeItem('selectedClient')
    }
  }, [selectedClient])

  useEffect(() => {
    localStorage.setItem('garments', JSON.stringify(garments))
  }, [garments])

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
      setOrderId,
      garments,
      setGarments
    }),
    [activeStep, selectedClient, garmentDetails, services, orderId, garments]
  )

  return <GarmentServiceOrderContext.Provider value={value}>{children}</GarmentServiceOrderContext.Provider>
}
