import { useState } from 'react'

import { Card, CardContent, Typography, Box, Button, Grid, LinearProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import ServiceItem from '@/components/garments/ServiceItem'
import ServiceSelectionDialog from '@/components/garments/garment-single-view/ServiceSelectionDialog'
import CreateServiceDialog from '@/components/garments/garment-service-table/CreateServiceDialog'

import { addGarmentService, updateServiceDoneStatus } from '@/app/actions/garments'

const ServicesSection = ({ garment, setGarment }) => {
  const { userId, getToken } = useAuth()
  const [isServiceDialogOpen, setServiceDialogOpen] = useState(false)
  const [isCreateServiceDialogOpen, setCreateServiceDialogOpen] = useState(false)
  const [isAddingService, setIsAddingService] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({})

  const totalServices = garment.services.length || 0
  const completedServices = garment.services.filter(service => service.is_done).length
  const progressPercentage = totalServices > 0 ? (completedServices / totalServices) * 100 : 0

  const handleServiceSelect = async service => {
    try {
      setIsAddingService(true)
      const token = await getToken({ template: 'supabase' })

      const newService = {
        garment_id: garment.id,
        name: service.name,
        description: service.description || '',
        qty: service.qty || 1,
        unit_price: parseFloat(service.unit_price),
        unit: service.unit
      }

      const addedService = await addGarmentService(userId, newService, token)

      setGarment(prevGarment => ({
        ...prevGarment,
        services: [...prevGarment.services, addedService]
      }))

      setServiceDialogOpen(false)
      setCreateServiceDialogOpen(false)

      toast.success(`${addedService.name} was added to the garment.`)
    } catch (error) {
      console.error('Error adding service to garment:', error)
      toast.error('Failed to add service. Please try again.')
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
      const token = await getToken({ template: 'supabase' })

      await updateServiceDoneStatus(userId, serviceId, newStatus, token)

      toast.success(`Service marked as ${newStatus ? 'completed' : 'incomplete'}.`)
    } catch (error) {
      console.error('Error updating service status:', error)
      toast.error('Failed to update service status. Please try again.')

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
    <Card elevation={3} sx={{ mb: 4 }}>
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
        userId={userId}
        handleServiceSelect={handleServiceSelect}
        isAddingService={isAddingService}
      />

      {/* Create Service Dialog */}
      <CreateServiceDialog
        open={isCreateServiceDialogOpen}
        onClose={() => setCreateServiceDialogOpen(false)}
        onServiceSelect={handleServiceSelect}
      />
    </Card>
  )
}

export default ServicesSection
