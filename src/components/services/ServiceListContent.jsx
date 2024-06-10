import React from 'react'

import { Box, List, ListItem, Typography, CircularProgress } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { deleteService, editService, duplicateService } from '@/app/actions/services'
import ServiceItem from './ServiceItem'

const ServiceListContent = ({ services, setServices }) => {
  const { getToken } = useAuth()

  const handleDelete = async id => {
    const token = await getToken({ template: 'supabase' })

    try {
      await deleteService(id, token)
      setServices(prevServices => prevServices.filter(service => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleEdit = async (id, updatedService) => {
    const token = await getToken({ template: 'supabase' })

    try {
      const updatedServiceItem = await editService(id, updatedService, token)

      setServices(prevServices => prevServices.map(service => (service.id === id ? updatedServiceItem : service)))
    } catch (error) {
      console.error('Error editing service:', error)
    }
  }

  const handleDuplicate = async id => {
    const token = await getToken({ template: 'supabase' })

    try {
      const duplicatedService = await duplicateService(id, token)

      setServices(prevServices => [...prevServices, duplicatedService])
    } catch (error) {
      console.error('Error duplicating service:', error)
    }
  }

  return (
    <Box>
      {services && services.length > 0 ? (
        <List>
          {services.map(service => (
            <ListItem key={service.id}>
              <ServiceItem
                service={service}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No services available!</Typography>
      )}
    </Box>
  )
}

export default ServiceListContent
