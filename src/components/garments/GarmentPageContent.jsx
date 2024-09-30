'use client'

import { useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'
import ServiceItem from '@/components/garments/ServiceItem'
import ServicesSearch from '@/components/services/ServicesSearch'
import CreateServiceDialog from '@/components/garments/garment-service-table/CreateServiceDialog'
import TimeTracker from '@/components/garments/TimeTracker'
import Finances from '@/components/garments/Finances'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { getContrastText } from '@/utils/colorUtils'
import { addGarmentService, updateServiceDoneStatus, updateGarmentStage } from '@/app/actions/garments'

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
  const stageColor = currentStage?.color || 'grey.300'
  const textColor = getContrastText(stageColor)

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
              <Typography variant='h4' gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
                {garment.name}
              </Typography>
              {garment.image_cloud_id ? (
                <CldImage src={garment.image_cloud_id} alt={garment.name} width={300} height={300} crop='fill' />
              ) : (
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'grey.200'
                  }}
                >
                  <i className='ri-t-shirt-line' style={{ fontSize: '5rem', color: 'grey' }} />
                </Box>
              )}

              <Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 1 }}>
                <AccessTimeIcon color='action' />
                <Typography variant='body1'>
                  <strong>Due Date:</strong> {garment.due_date ? format(new Date(garment.due_date), 'PPP') : 'Not set'}
                </Typography>
              </Stack>
              {garment.is_event && garment.event_date && (
                <Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 1 }}>
                  <EventIcon color='action' />
                  <Typography variant='body1'>
                    <strong>Event Date:</strong> {format(new Date(garment.event_date), 'PPP')}
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                Client Information
              </Typography>
              <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
                <PersonIcon color='action' />
                <Typography variant='body1'>{garment.client.full_name}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
                <EmailIcon color='action' />
                <Typography variant='body1'>{garment.client.email}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center' spacing={1}>
                <PhoneIcon color='action' />
                <Typography variant='body1'>{formatPhoneNumber(garment.client.phone_number)}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column */}
        <Grid item xs={12} md={6}>
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
                        isDone={serviceStatuses[service.id]}
                        handleStatusChange={handleStatusChange}
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
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  backgroundColor: stageColor,
                  color: textColor,
                  padding: 2,
                  borderRadius: 1,
                  mb: 6,
                  textAlign: 'center'
                }}
              >
                <Typography variant='h6'>{garment.stage_name || 'Stage Not Set'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth>
                  <InputLabel id='stage-select-label'>Garment Stage</InputLabel>
                  <Select
                    labelId='stage-select-label'
                    value={garment.stage_id || ''}
                    label='Select Stage'
                    onChange={handleStageChange}
                    disabled={isStageChanging}
                  >
                    {stages.map(stage => (
                      <MenuItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {isStageChanging && <CircularProgress size={24} sx={{ ml: 2 }} />}
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardHeader title='Schedule Appointment' />
            <CardContent>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleOpenAddAppointmentModal}
                startIcon={<CalendarMonthIcon />}
              >
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
          <TimeTracker sx={{ mt: 2 }} />
          <Finances sx={{ mt: 2 }} />
          <Card sx={{ mt: 2 }}>
            <CardHeader title='Garment Notes' />
            <CardContent>
              <Typography variant='body1'>{garment.notes || 'No notes'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Service Selection Dialog */}
      <Dialog open={isServiceDialogOpen} onClose={() => setServiceDialogOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>
          Select or Create a Service
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => setServiceDialogOpen(false)}
            aria-label='close'
            sx={{
              position: 'absolute',
              right: 16,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ServicesSearch userId={userId} onServiceSelect={handleServiceSelect} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialogOpen(false)} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
