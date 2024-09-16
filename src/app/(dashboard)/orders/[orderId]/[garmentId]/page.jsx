'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useAuth } from '@clerk/nextjs'
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'

import { getGarmentById, getStages, updateGarmentStage } from '@/app/actions/garments'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import TimeTracker from '@/components/garments/TimeTracker'
import Finances from '@/components/garments/Finances'

export default function GarmentPage() {
  const [garment, setGarment] = useState(null)
  const [stages, setStages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { orderId, garmentId } = useParams()
  const { userId, getToken } = useAuth()

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
        } catch (error) {
          console.error('Failed to fetch data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [userId, orderId, garmentId, getToken])

  // Handler for changing the stage
  const handleStageChange = async event => {
    const newStageId = event.target.value

    try {
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      // Update garment's stage in the database
      await updateGarmentStage(userId, garment.id, newStageId, token)

      // Update the garment state
      setGarment(prevGarment => ({
        ...prevGarment,
        stage_id: newStageId,
        stage_name: stages.find(stage => stage.id === newStageId)?.name || 'Unknown'
      }))
    } catch (error) {
      console.error('Failed to update garment stage:', error)
    }
  }

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
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: `Order #${orderId}`, href: `/orders/${orderId}` },
          { label: garment.name, href: `/orders/${orderId}/${garment.id}` }
        ]}
      />
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
            <CardHeader title='Services' />
            <CardContent>
              {garment.services.map((service, index) => (
                <Typography key={index} variant='body1'>
                  {service.name}: {service.qty} {service.unit} - ${parseFloat(service.unit_price).toFixed(2)}
                </Typography>
              ))}
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
              <Typography variant='h6' gutterBottom>
                Stage
              </Typography>
              <FormControl fullWidth>
                <InputLabel id='stage-select-label'>Select Stage</InputLabel>
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
          <TimeTracker sx={{ mt: 2 }} />
          <Finances sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    </>
  )
}
