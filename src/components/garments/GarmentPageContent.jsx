'use client'

import { useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Button, Divider } from '@mui/material'
import { toast } from 'react-toastify'

import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'
import CreateServiceDialog from '@/components/garments/garment-service-table/CreateServiceDialog'
import TimeTracker from '@/components/garments/TimeTracker'
import Finances from '@/components/garments/Finances'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import { addGarmentService, updateServiceDoneStatus, updateGarmentStage } from '@/app/actions/garments'

import GarmentImage from '@/components/garments/garment-single-view/GarmentImage'
import ClientInformation from '@/components/garments/garment-single-view/ClientInformation'
import ServicesSection from '@/components/garments/garment-single-view/ServicesSection'
import StageSelector from '@/components/garments/garment-single-view/StageSelector'
import GarmentNotes from '@/components/garments/garment-single-view/GarmentNotes'
import GarmentDates from '@/components/garments/garment-single-view/GarmentDates'

// Import the new ServiceSelectionDialog component
import ServiceSelectionDialog from '@/components/garments/garment-single-view/ServiceSelectionDialog'
import ScheduleAppointment from '@/components/garments/garment-single-view/ScheduleAppointment'

export default function GarmentPageContent({ initialGarment, initialStages }) {
  const [garment, setGarment] = useState(initialGarment)
  const [stages, setStages] = useState(initialStages)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingService, setIsAddingService] = useState(false)
  const { orderId, garmentId } = useParams()
  const searchParams = useSearchParams()
  const { userId, getToken } = useAuth()

  const fromPage = searchParams.get('from')
  const showBackButton = fromPage === 'garments' || fromPage === 'home'

  const [serviceStatuses, setServiceStatuses] = useState(
    initialGarment.services.reduce((acc, service) => ({ ...acc, [service.id]: service.is_done }), {})
  )

  const [isServiceDialogOpen, setServiceDialogOpen] = useState(false)
  const [isCreateServiceDialogOpen, setCreateServiceDialogOpen] = useState(false)
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)
  const [isStageChanging, setIsStageChanging] = useState(false)

  const handleOpenAddAppointmentModal = () => setIsAddAppointmentModalOpen(true)
  const handleCloseAddAppointmentModal = () => setIsAddAppointmentModalOpen(false)

  const handleServiceSelect = async service => {
    try {
      setIsAddingService(true)
      const token = await getToken({ template: 'supabase' })

      const newService = {
        garment_id: garmentId,
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
    const newStatus = !serviceStatuses[serviceId]

    setServiceStatuses(prevStatuses => ({
      ...prevStatuses,
      [serviceId]: newStatus
    }))

    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.map(service =>
        service.id === serviceId ? { ...service, is_done: newStatus } : service
      )
    }))

    try {
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')
      await updateServiceDoneStatus(userId, serviceId, newStatus, token)
    } catch (error) {
      console.error('Failed to update service status:', error)
      toast.error('Failed to update service status. Please try again later.')

      // Revert local state if update fails
      setServiceStatuses(prevStatuses => ({
        ...prevStatuses,
        [serviceId]: !newStatus
      }))

      setGarment(prevGarment => ({
        ...prevGarment,
        services: prevGarment.services.map(service =>
          service.id === serviceId ? { ...service, is_done: !newStatus } : service
        )
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

  const handleStageChange = async event => {
    const newStageId = event.target.value
    const newStage = stages.find(stage => stage.id === newStageId)
    const newStageName = newStage?.name || 'Unknown'
    const oldStageId = garment.stage_id
    const oldStageName = garment.stage_name

    // Optimistically update the UI
    setGarment(prevGarment => ({
      ...prevGarment,
      stage_id: newStageId,
      stage_name: newStageName
    }))

    setIsStageChanging(true)

    try {
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      // Perform the actual update
      await updateGarmentStage(userId, garment.id, newStageId, token)

      // If successful, show a success message
      toast.success(`Garment stage set to ${newStageName}`)
    } catch (error) {
      console.error('Failed to update garment stage:', error)

      // If the update fails, revert the optimistic update
      setGarment(prevGarment => ({
        ...prevGarment,
        stage_id: oldStageId,
        stage_name: oldStageName
      }))

      toast.error('Failed to update garment stage. Please try again later.')
    } finally {
      setIsStageChanging(false)
    }
  }

  const currentStage = stages.find(stage => stage.name === garment?.stage_name)

  const totalServices = garment?.services.length || 0
  const completedServices = Object.values(serviceStatuses).filter(status => status).length
  const progressPercentage = (completedServices / totalServices) * 100

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!garment) {
    return <Typography>Garment not found.</Typography>
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {showBackButton && (
          <>
            <Link href={fromPage === 'home' ? '/' : '/garments'} passHref>
              <Button variant='text' component='a'>
                &lt; Back to {fromPage === 'home' ? 'Home' : 'Garments'}
              </Button>
            </Link>
            <Divider
              orientation='vertical'
              flexItem
              sx={{ ml: { xs: 1, sm: 2 }, mr: 4, borderRightWidth: 2, borderColor: 'grey.300' }}
            />
          </>
        )}
        <Breadcrumb
          items={[
            { label: 'Orders', href: '/orders' },
            {
              label: `Order #${formatOrderNumber(garment.user_order_number)}`,
              href: `/orders/${orderId}`
            },
            { label: garment.name, href: `/orders/${orderId}/${garment.id}` }
          ]}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Column */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <GarmentImage garment={garment} />
              <GarmentDates garment={garment} /> {/* GarmentDates now placed below GarmentImage within the Card */}
            </CardContent>
          </Card>
          <ClientInformation client={garment.client} />
        </Grid>

        {/* Middle Column */}
        <Grid item xs={12} md={6}>
          <ServicesSection
            garment={garment}
            serviceStatuses={serviceStatuses}
            handleStatusChange={handleStatusChange}
            handleServiceDeleted={handleServiceDeleted}
            handleServiceUpdated={handleServiceUpdated}
            setServiceDialogOpen={setServiceDialogOpen}
            isAddingService={isAddingService}
            completedServices={completedServices}
            totalServices={totalServices}
            progressPercentage={progressPercentage}
          />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={3}>
          <StageSelector
            garment={garment}
            stages={stages}
            handleStageChange={handleStageChange}
            isStageChanging={isStageChanging}
            currentStage={currentStage}
          />
          <ScheduleAppointment handleOpenAddAppointmentModal={handleOpenAddAppointmentModal} />
          <TimeTracker sx={{ mt: 2 }} />
          <Finances sx={{ mt: 2 }} />
          <GarmentNotes notes={garment.notes} />
        </Grid>
      </Grid>

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

      {/* AddAppointmentModal */}
      <AddAppointmentModal
        addEventModalOpen={isAddAppointmentModalOpen}
        handleAddEventModalToggle={handleCloseAddAppointmentModal}
        client={{ id: garment.client.id, full_name: garment.client.full_name }}
      />
    </>
  )
}
