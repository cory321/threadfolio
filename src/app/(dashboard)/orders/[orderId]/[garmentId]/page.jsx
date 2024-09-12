'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useAuth } from '@clerk/nextjs'
import { Typography, Box, CircularProgress, Paper, Grid } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import { format } from 'date-fns'

import { getGarmentById } from '@/app/actions/garments'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

export default function GarmentPage() {
  const [garment, setGarment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { orderId, garmentId } = useParams()
  const { userId, getToken } = useAuth()

  useEffect(() => {
    async function fetchGarment() {
      if (userId && orderId && garmentId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')
          const fetchedGarment = await getGarmentById(userId, orderId, garmentId, token)

          setGarment(fetchedGarment)
        } catch (error) {
          console.error('Failed to fetch garment:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchGarment()
  }, [userId, orderId, garmentId, getToken])

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
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant='h4' gutterBottom>
              {garment.name}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Stage: {garment.stage}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Due Date: {garment.due_date ? format(new Date(garment.due_date), 'PPP') : 'Not set'}
            </Typography>
            {garment.is_event && garment.event_date && (
              <Typography variant='body1' gutterBottom>
                Event Date: {format(new Date(garment.event_date), 'PPP')}
              </Typography>
            )}
            <Typography variant='body1' gutterBottom>
              Notes: {garment.notes || 'No notes'}
            </Typography>

            <Typography variant='h6' sx={{ mt: 2 }}>
              Client Information
            </Typography>
            <Typography variant='body1'>Name: {garment.client.full_name}</Typography>
            <Typography variant='body1'>Email: {garment.client.email}</Typography>
            <Typography variant='body1'>Phone: {formatPhoneNumber(garment.client.phone_number)}</Typography>

            <Typography variant='h6' sx={{ mt: 2 }}>
              Services
            </Typography>
            {garment.services.map((service, index) => (
              <Typography key={index} variant='body1'>
                {service.name}: {service.qty} {service.unit} - ${parseFloat(service.unit_price).toFixed(2)}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
