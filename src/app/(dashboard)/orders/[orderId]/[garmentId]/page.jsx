'use client'

import { useEffect, useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
  Stack,
  Chip,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  LinearProgress
} from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'

import { toast } from 'react-toastify'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ChecklistIcon from '@mui/icons-material/Checklist'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import TaskAltIcon from '@mui/icons-material/TaskAlt'

import { useTheme } from '@mui/material/styles'

import ServiceTodoList from '@/components/garments/ServiceTodoList'
import ServiceItem from '@/components/garments/ServiceItem'

import { getGarmentById, getStages, updateGarmentStage, updateServiceDoneStatus } from '@/app/actions/garments'
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
  const { orderId, garmentId } = useParams()
  const searchParams = useSearchParams()
  const { userId, getToken } = useAuth()

  const fromPage = searchParams.get('from')
  const showBackButton = fromPage === 'garments'

  const [serviceStatuses, setServiceStatuses] = useState({})

  const handleStatusChange = async serviceId => {
    const newStatus = !serviceStatuses[serviceId]

    // Update local state optimistically
    setServiceStatuses(prevStatuses => ({
      ...prevStatuses,
      [serviceId]: newStatus
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
    }
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

  const theme = useTheme()

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
            <Link href='/garments' passHref>
              <Button variant='text' component='a'>
                &lt; Back to Garments
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
          <Card>
            <CardHeader title='Garment Project Details' />
            <Box sx={{ px: 5 }}>
              <Typography variant='subtitle1' sx={{ mt: 2, mx: 2 }}>
                {`${Math.round(progressPercentage)}% Services Completed`}
              </Typography>
              <LinearProgress
                variant='determinate'
                value={progressPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main'
                  }
                }}
              />
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                {garment.services.map(service => {
                  const isDone = serviceStatuses[service.id] || false

                  return (
                    <ServiceItem
                      key={service.id}
                      service={service}
                      isDone={isDone}
                      handleStatusChange={handleStatusChange}
                    />
                  )
                })}
              </Grid>
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
            <Typography variant='h6' sx={{ p: 6 }}>
              Schedule Followup Appointment
            </Typography>
          </Card>
          <TimeTracker sx={{ mt: 2 }} />
          <Finances sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    </>
  )
}
