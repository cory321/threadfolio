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

import { getGarmentById, getStages, updateGarmentStage } from '@/app/actions/garments'
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

  const handleStatusChange = serviceId => {
    setServiceStatuses(prevStatuses => ({
      ...prevStatuses,
      [serviceId]: !prevStatuses[serviceId]
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

          console.log('Fetched Garment:', fetchedGarment)

          setGarment(fetchedGarment)
          setStages(fetchedStages)
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
  const completedServices = garment?.services.filter(service => serviceStatuses[service.id]).length || 0
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
                {garment.services.map((service, index) => {
                  const isDone = serviceStatuses[service.id] || false

                  return (
                    <Grid item xs={12} key={index}>
                      <Card
                        variant='outlined'
                        sx={{
                          position: 'relative',
                          border: '2px solid',
                          borderColor: isDone ? 'success.main' : 'inherit',
                          transition: 'border-color 0.3s'
                        }}
                      >
                        {isDone && (
                          <Chip
                            label='Done'
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backgroundColor: '#c5f799',
                              color: 'black'
                            }}
                          />
                        )}

                        <CardContent>
                          <FormControlLabel
                            control={
                              <Checkbox
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<TaskAltIcon />}
                                checked={isDone}
                                onChange={() => handleStatusChange(service.id)}
                                sx={{
                                  color: 'primary.main',
                                  '&.Mui-checked': {
                                    color: 'success.main'
                                  }
                                }}
                              />
                            }
                            label={<Typography variant='h5'>{service.name}</Typography>}
                            sx={{
                              mb: 1,
                              display: 'inline-flex',
                              padding: '8px',
                              borderRadius: '4px',
                              '& .MuiTypography-root': {
                                color: isDone ? 'text.primary' : 'primary.main',
                                transition: 'text-decoration 0.3s'
                              },
                              '&:hover .MuiTypography-root': {
                                textDecoration: 'underline'
                              }
                            }}
                          />

                          {service.description && (
                            <Typography variant='body2' color='textSecondary' gutterBottom>
                              {service.description}
                            </Typography>
                          )}

                          <Grid container spacing={2} alignItems='center'>
                            <Grid item xs={12} sm={6}>
                              <Box>
                                <Typography variant='body2'>
                                  <strong>Quantity:</strong> {service.qty} {service.unit}
                                </Typography>
                                <Typography variant='body2'>
                                  <strong>Price:</strong> ${parseFloat(service.unit_price).toFixed(2)}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                                <ButtonBase
                                  sx={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    p: 1,
                                    borderRadius: 1,
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                      '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
                                      '& .MuiTypography-root': { color: theme.palette.primary.main }
                                    }
                                  }}
                                >
                                  <AccessTimeIcon
                                    sx={{ mb: 0.5, fontSize: '2rem', color: theme.palette.text.secondary }}
                                  />
                                  <Typography variant='caption' color='text.secondary'>
                                    Track Time
                                  </Typography>
                                </ButtonBase>
                                <ButtonBase
                                  sx={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    p: 1,
                                    borderRadius: 1,
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                      '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
                                      '& .MuiTypography-root': { color: theme.palette.primary.main }
                                    }
                                  }}
                                >
                                  <ChecklistIcon
                                    sx={{ mb: 0.5, fontSize: '2rem', color: theme.palette.text.secondary }}
                                  />
                                  <Typography variant='caption' color='text.secondary'>
                                    Todo List
                                  </Typography>
                                </ButtonBase>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
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
