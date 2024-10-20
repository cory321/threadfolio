'use client'
import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react'

export const GarmentServiceOrderContext = createContext()

export const GarmentServiceOrderProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedClient, setSelectedClient] = useState(null)

  const [garmentDetails, setGarmentDetails] = useState({
    id: null,
    name: '',
    instructions: '',
    due_date: null,
    is_event: false,
    event_date: null,
    image_cloud_id: '',
    image_metadata: { width: 0, height: 0 },
    services: []
  })

  const [services, setServices] = useState([])
  const [orderId, setOrderId] = useState(null)
  const [garments, setGarments] = useState([])

  // Function to add or update a garment
  const addOrUpdateGarment = useCallback(garment => {
    setGarments(prevGarments => {
      const index = prevGarments.findIndex(g => g.id === garment.id)

      if (index !== -1) {
        // Update existing garment
        const updatedGarments = [...prevGarments]

        updatedGarments[index] = garment

        return updatedGarments
      } else {
        // Add new garment
        return [...prevGarments, garment]
      }
    })
  }, [])

  // Function to remove a garment
  const removeGarment = useCallback(garmentId => {
    setGarments(prevGarments => prevGarments.filter(g => g.id !== garmentId))
  }, [])

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
      setGarments,
      addOrUpdateGarment,
      removeGarment // Add removeGarment to context value
    }),
    [activeStep, selectedClient, garmentDetails, services, orderId, garments, addOrUpdateGarment, removeGarment]
  )

  return <GarmentServiceOrderContext.Provider value={value}>{children}</GarmentServiceOrderContext.Provider>
}
