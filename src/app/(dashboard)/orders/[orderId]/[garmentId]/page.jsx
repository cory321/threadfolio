'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

import { useAuth } from '@clerk/nextjs'
import {
  Typography,
  Box,
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
  DialogActions
} from '@mui/material'

import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'

import { useTheme } from '@mui/material/styles'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'

import ServiceItem from '@/components/garments/ServiceItem'
import ServicesSearch from '@/components/services/ServicesSearch'
import CreateServiceDialog from '@/components/garments/garment-service-table/CreateServiceDialog'
import {
  getGarmentById,
  getStages,
  updateGarmentStage,
  updateServiceDoneStatus,
  addGarmentService // Import the new action
} from '@/app/actions/garments'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import TimeTracker from '@/components/garments/TimeTracker'
import Finances from '@/components/garments/Finances'
import { formatOrderNumber } from '@/utils/formatOrderNumber'
import { getContrastText } from '@/utils/colorUtils'

export default function GarmentPage() {
  const [garment, setGarment] = useState(null)
  const [stages, setStages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingService, setIsAddingService] = useState(false)
  const { orderId, garmentId } = useParams()
  const searchParams = useSearchParams()
  const { userId, getToken } = useAuth()

  const fromPage = searchParams.get('from')
  const showBackButton = fromPage === 'garments' || fromPage === 'home'

  const [serviceStatuses, setServiceStatuses] = useState({})
  const [isServiceDialogOpen, setServiceDialogOpen] = useState(false)
  const [isCreateServiceDialogOpen, setCreateServiceDialogOpen] = useState(false)

  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)

  const handleOpenAddAppointmentModal = () => {
    setIsAddAppointmentModalOpen(true)
  }

  const handleCloseAddAppointmentModal = () => {
    setIsAddAppointmentModalOpen(false)
  }

  // Function to handle adding a new service to the garment
  const handleServiceSelect = async service => {
    try {
      setIsAddingService(true)
      const token = await getToken({ template: 'supabase' })

      // Prepare the new service data
      const newService = {
        garment_id: garmentId,
        name: service.name,
        description: service.description || '',
        qty: service.qty || 1,
        unit_price: parseFloat(service.unit_price),
        unit: service.unit
      }

      // Add the service to the database
      const addedService = await addGarmentService(userId, newService, token)

      // Update the garment's services in state
      setGarment(prevGarment => ({
        ...prevGarment,
        services: [...prevGarment.services, addedService]
      }))

      // Close the dialog
      setServiceDialogOpen(false)
      setCreateServiceDialogOpen(false)

      toast.success(`Service "${addedService.name}" added to the garment.`)
    } catch (error) {
      console.error('Error adding service to garment:', error)
      toast.error('Failed to add service. Please try again.')
    } finally {
      setIsAddingService(false)
    }
  }

  const handleStatusChange = async serviceId => {
    const newStatus = !serviceStatuses[serviceId]

    // Optimistic update of serviceStatuses
    setServiceStatuses(prevStatuses => ({
      ...prevStatuses,
      [serviceId]: newStatus
    }))

    // Optimistic update of garment.services
    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.map(service =>
        service.id === serviceId ? { ...service, is_done: newStatus } : service
      )
    }))

    try {
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      // Update the status in the database
      await updateServiceDoneStatus(userId, serviceId, newStatus, token)
    } catch (error) {
      console.error('Failed to update service status:', error)
      toast.error('Failed to update service status. Please try again later.')

      // Revert local state if update fails
      setServiceStatuses(prevStatuses => ({
        ...prevStatuses,
        [serviceId]: !newStatus
      }))

      // Revert the garment.services state
      setGarment(prevGarment => ({
        ...prevGarment,
        services: prevGarment.services.map(service =>
          service.id === serviceId ? { ...service, is_done: !newStatus } : service
        )
      }))
    }
  }

  // Function to handle service deletion
  const handleServiceDeleted = serviceId => {
    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.filter(service => service.id !== serviceId)
    }))
  }

  // Function to handle service updates
  const handleServiceUpdated = (serviceId, updatedData) => {
    setGarment(prevGarment => ({
      ...prevGarment,
      services: prevGarment.services.map(service =>
        service.id === serviceId ? { ...service, ...updatedData } : service
      )
    }))
  }

  useEffect(() => {
    async function fetchData() {
      if (userId && orderId && garmentId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')

          const fetchedGarment = await getGarmentById(userId, orderId, garmentId, token)
          const fetchedStages = await getStages(userId, token)

          setGarment(fetchedGarment)
          setStages(fetchedStages)

          // Initialize service statuses from the fetched data
          const statuses = {}

          fetchedGarment.services.forEach(service => {
            statuses[service.id] = service.is_done
          })
          setServiceStatuses(statuses)
        } catch (error) {
          console.error('Failed to fetch data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [userId, orderId, garmentId, getToken])

  const handleStageChange = async event => {
    const newStageId = event.target.value
    const newStageName = stages.find(stage => stage.id === newStageId)?.name || 'Unknown'

    try {
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      await updateGarmentStage(userId, garment.id, newStageId, token)

      setGarment(prevGarment => ({
        ...prevGarment,
        stage_id: newStageId,
        stage_name: newStageName
      }))

      toast.success(`Garment stage set to ${newStageName}`)
    } catch (error) {
      console.error('Failed to update garment stage:', error)
      toast.error('Failed to update garment stage. Please try again later.')
    }
  }

  const currentStage = stages.find(stage => stage.name === garment?.stage_name)
  const stageColor = currentStage?.color || 'grey.300'
  const textColor = getContrastText(stageColor)

  // Calculate progress percentage
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
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
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
              <Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
                {garment.name}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Due Date: {garment.due_date ? format(new Date(garment.due_date), 'PPP') : 'Not set'}
              </Typography>
              {garment.is_event && garment.event_date && (
                <Typography variant='body1' gutterBottom>
                  Event Date: {format(new Date(garment.event_date), 'PPP')}
                </Typography>
              )}
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Client Information
              </Typography>
              <Typography variant='body1'>Name: {garment.client.full_name}</Typography>
              <Typography variant='body1'>Email: {garment.client.email}</Typography>
              <Typography variant='body1'>Phone: {formatPhoneNumber(garment.client.phone_number)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Box>
                  <Typography variant='h5' gutterBottom>
                    Requested Services for Garment
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
                    value={(completedServices / totalServices) * 100}
                    sx={{ mt: 2, mb: 3, height: 10, borderRadius: 5 }}
                  />

                  {/* List of services */}
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
          <Card sx={{ mt: 2 }}>
            <CardHeader title='Notes' />
            <CardContent>
              <Typography variant='body1'>{garment.notes || 'No notes'}</Typography>
            </CardContent>
          </Card>
        </Grid>
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
                <Typography variant='h6'>{currentStage?.name || 'Stage Not Set'}</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel id='stage-select-label'>Garment Stage</InputLabel>
                <Select
                  labelId='stage-select-label'
                  value={garment.stage_id || ''}
                  label='Select Stage'
                  onChange={handleStageChange}
                >
                  {stages.map(stage => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardHeader title='Schedule Appointment' />
            <CardContent>
              {/* Add a button to open the modal */}
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
        </Grid>
      </Grid>

      {/* Service Selection Dialog */}
      <Dialog open={isServiceDialogOpen} onClose={() => setServiceDialogOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Select or Create a Service</DialogTitle>
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

      {/* Include the AddAppointmentModal and pass the client information */}
      <AddAppointmentModal
        addEventModalOpen={isAddAppointmentModalOpen}
        handleAddEventModalToggle={handleCloseAddAppointmentModal}
        client={{ id: garment.client.id, full_name: garment.client.full_name }}
      />
    </>
  )
}
