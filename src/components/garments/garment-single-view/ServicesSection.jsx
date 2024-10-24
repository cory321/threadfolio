import { useState } from 'react'

import { Card, CardContent, Typography, Box, Button, Grid, LinearProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/nextjs'

import ServiceItem from '@/components/garments/ServiceItem'
import ServiceSelectionDialog from '@/components/garments/garment-single-view/ServiceSelectionDialog'
import { addGarmentService, updateServiceDoneStatus } from '@/app/actions/garmentServices'

const ServicesSection = ({ garment, setGarment }) => {
  const { userId } = useAuth()
  const [isServiceDialogOpen, setServiceDialogOpen] = useState(false)
  const [isAddingService, setIsAddingService] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({})

  const totalServices = garment.services.length || 0
  const completedServices = garment.services.filter(service => service.is_done).length
  const progressPercentage = totalServices > 0 ? (completedServices / totalServices) * 100 : 0

  const handleServiceSelect = async service => {
    try {
      setIsAddingService(true)

      const newService = {
        garment_id: garment.id,
        name: service.name,
        description: service.description || '',
        qty: service.qty || 1,
        unit_price: parseFloat(service.unit_price),
        unit: service.unit
      }

      const addedService = await addGarmentService(userId, newService)

      setGarment(prevGarment => ({
        ...prevGarment,
        services: [...prevGarment.services, addedService]
      }))
      setServiceDialogOpen(false)
      toast.success(`${addedService.name} was added to the garment.`, {
        hideProgressBar: false
      })
    } catch (error) {
      console.error('Error adding service to garment:', error)
      toast.error('Failed to add service. Please try again.', {
        hideProgressBar: false
      })
    } finally {
      setIsAddingService(false)
    }
  }

  const handleStatusChange = async serviceId => {
    const currentStatus = garment.services.find(service => service.id === serviceId)?.is_done || false
    const newStatus = !currentStatus

    // Optimistic UI update
    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.map(service =>
        service.id === serviceId ? { ...service, is_done: newStatus } : service
      )
    }))

    setIsUpdatingStatus(prevState => ({
      ...prevState,
      [serviceId]: true
    }))

    try {
      await updateServiceDoneStatus(userId, serviceId, newStatus)
      toast.success(`Service marked as ${newStatus ? 'completed' : 'incomplete'}.`, {
        hideProgressBar: false
      })
    } catch (error) {
      console.error('Error updating service status:', error)
      toast.error('Failed to update service status. Please try again.', {
        hideProgressBar: false
      })

      // Revert optimistic update
      setGarment(prevGarment => ({
        ...prevGarment,
        services: prevGarment.services.map(service =>
          service.id === serviceId ? { ...service, is_done: currentStatus } : service
        )
      }))
    } finally {
      setIsUpdatingStatus(prevState => ({
        ...prevState,
        [serviceId]: false
      }))
    }
  }

  const handleServiceDeleted = serviceId => {
    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.filter(service => service.id !== serviceId)
    }))
  }

  const handleServiceUpdated = (serviceId, updatedData) => {
    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.map(service =>
        service.id === serviceId ? { ...service, ...updatedData } : service
      )
    }))
  }

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography variant='h5' gutterBottom>
              Services Requested
            </Typography>
            {garment.services && garment.services.length > 0 && (
              <Typography variant='body2' color='textSecondary'>
                {`${completedServices}/${totalServices} Services Completed`}
              </Typography>
            )}
          </Box>
          <Button
            variant='outlined'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => setServiceDialogOpen(true)}
            disabled={isAddingService}
          >
            {isAddingService ? 'Adding Service...' : 'Add Service'}
          </Button>
        </Box>
        {garment.services && garment.services.length > 0 ? (
          <>
            <LinearProgress
              variant='determinate'
              value={progressPercentage}
              sx={{ mt: 2, mb: 3, height: 10, borderRadius: 5 }}
            />
            <Grid container spacing={2}>
              {garment.services.map(service => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  isDone={service.is_done}
                  handleStatusChange={() => handleStatusChange(service.id)}
                  isUpdatingStatus={isUpdatingStatus[service.id]}
                  onServiceDeleted={handleServiceDeleted}
                  onServiceUpdated={handleServiceUpdated}
                  garmentName={garment.name}
                />
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant='body1' color='textSecondary' sx={{ mt: 2 }}>
            This garment has no services attached to it.
          </Typography>
        )}
      </CardContent>

      {/* Service Selection Dialog */}
      <ServiceSelectionDialog
        isOpen={isServiceDialogOpen}
        onClose={() => setServiceDialogOpen(false)}
        handleServiceSelect={handleServiceSelect}
        isAddingService={isAddingService}
      />
    </Card>
  )
}

export default ServicesSection
